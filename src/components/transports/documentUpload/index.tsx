"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Eye, Trash, LoaderCircle } from "lucide-react"
import { cn } from "~/lib/utils"
import { toast } from "~/hooks/use-toast"

export type DocumentType = "driversLicense" | "guideLicense" | "insurance"

interface UploadedDocument {
    url: string
    pathname: string
    size: number
    uploadedAt: string
    type: DocumentType
}

interface DocumentUploadModalProps {
    entityType: "driver" | "vehicle" | "guide";
    entityId: string;
    existingDocumentURLs: {
        documentType: DocumentType;
        url: string | null;
    }[];
}

export function DocumentUploadModal({ entityId, entityType, existingDocumentURLs }: DocumentUploadModalProps) {
    const [open, setOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [documentType, setDocumentType] = useState<DocumentType>("driversLicense")
    const [isUploading, setIsUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")
    const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        // Load existing documents
        if (existingDocumentURLs) {
            setUploadedDocuments(existingDocumentURLs.filter((doc) => doc.url !== null).map((doc) => ({
                url: doc.url!,
                pathname: doc.url!,
                size: 0,
                uploadedAt: new Date().toISOString(),
                type: doc.documentType,
            })))
        }
    }
        , [existingDocumentURLs])


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        setSelectedFile(file)

        // Reset status when a new file is selected
        setUploadStatus("idle")
        setErrorMessage("")
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            setErrorMessage("Please select a file")
            setUploadStatus("error")
            return
        }

        if (!selectedFile.type.includes("pdf")) {
            setErrorMessage("Only PDF files are allowed")
            setUploadStatus("error")
            return
        }

        setIsUploading(true)
        setUploadStatus("idle")

        try {
            const formData = new FormData()
            formData.append("file", selectedFile)
            formData.append("documentType", documentType)
            formData.append("entityId", entityId)
            formData.append("entityType", entityType)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Upload failed")
            }

            const blob = await response.json()

            setUploadedDocuments((prev) => [
                ...prev,
                {
                    url: blob.url,
                    pathname: blob.pathname,
                    size: blob.size,
                    uploadedAt: new Date().toISOString(),
                    type: documentType,
                },
            ])

            setUploadStatus("success")
            setSelectedFile(null)

            // Reset the file input
            const fileInput = document.getElementById("file-upload") as HTMLInputElement
            if (fileInput) fileInput.value = ""

            // Close the modal after a successful upload
            setTimeout(() => {
                setOpen(false)
                setUploadStatus("idle")
            }, 2000)
        } catch (error) {
            console.error("Upload error:", error)
            setUploadStatus("error")
            setErrorMessage(error instanceof Error ? error.message : "Upload failed")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (url: string, typeOfDocument: DocumentType) => {
        setIsDeleting(true)
        try {
            const formData = new FormData()
            formData.append("url", url)
            formData.append("documentType", typeOfDocument)
            formData.append("entityId", entityId)
            formData.append("entityType", entityType)

            const response = await fetch("/api/upload", {
                method: "DELETE",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Delete failed")
            }

            setUploadedDocuments((prev) => prev.filter((doc) => doc.url !== url))
            setIsDeleting(false)
            toast({
                title: "Document deleted",
                description: "The document has been deleted successfully.",
            })
        } catch (error) {
            console.error("Delete error:", error)
            setUploadStatus("error")
            setErrorMessage(error instanceof Error ? error.message : "Delete failed")
            setIsDeleting(false)
            toast({
                title: "Error",
                description: "The document couldn't be deleted.",
            })
        }
    }

    return (
        <div className="w-full flex flex-col justify-center gap-4 mt-2 max-w-[400px]">
            {/* Display uploaded documents */}
            {uploadedDocuments.length > 0 && (
                <div className="w-full">
                    {/* <h3 className="text-lg font-medium mb-4">Uploaded Documents</h3> */}
                    <div className="grid gap-2">
                        {uploadedDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-6 w-6 text-primary" />
                                    <div>
                                        <p className="font-normal text-[13px]">
                                            {doc.type === "driversLicense" ? "Driver's License" : "Vehicle Registration"}
                                        </p>
                                        {/* <p className="text-sm text-muted-foreground">
                                    {new Date(doc.uploadedAt).toLocaleString()} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                                        </p> */}
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <Button variant="outline" size="icon" asChild disabled={isDeleting}>
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                            <Eye className="w-4 h-4" /> {/* Size 15px (4 in Tailwind) */}
                                        </a>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(doc.url, doc.type)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (<LoaderCircle size={15} className="animate-spin"/>) : (
                                            <Trash className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            )}
            {existingDocumentURLs.some(d => d.url === null) && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2" variant={"primaryGreen"}>
                            <Upload className="h-4 w-4" />
                            Upload Documents
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Upload Document</DialogTitle>
                            <DialogDescription>Upload your driver's license or vehicle registration as a PDF file.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <RadioGroup
                                value={documentType}
                                onValueChange={(value: any) => setDocumentType(value as DocumentType)}
                                className="grid grid-cols-2 gap-4"
                            >
                                {existingDocumentURLs.filter((doc) => doc.url === null).map((doc) => (
                                    <div key={doc.documentType}>
                                        <RadioGroupItem value={doc.documentType} id={doc.documentType.toLowerCase()} className="peer sr-only" />
                                        <Label
                                            htmlFor={doc.documentType.toLowerCase()}
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                        >
                                            <FileText className="mb-3 h-6 w-6" />
                                            {doc.documentType.split(/(?=[A-Z])/).join(" ").replace(/^\w/, (c) => c.toUpperCase())}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>

                            <div className="grid gap-2">
                                <Label htmlFor="file-upload">Upload PDF</Label>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor="file-upload"
                                            className={cn(
                                                "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-900 dark:border-gray-700",
                                                selectedFile && "border-primary bg-primary/5",
                                            )}
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {selectedFile ? (
                                                    <>
                                                        <FileText className="w-8 h-8 mb-2 text-primary" />
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{selectedFile.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF only</p>
                                                    </>
                                                )}
                                            </div>
                                            <input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                                        </label>
                                    </div>

                                    {uploadStatus === "error" && (
                                        <div className="flex items-center gap-2 text-destructive text-sm">
                                            <AlertCircle className="h-4 w-4" />
                                            {errorMessage || "Upload failed. Please try again."}
                                        </div>
                                    )}

                                    {uploadStatus === "success" && (
                                        <div className="flex items-center gap-2 text-primary text-sm">
                                            <CheckCircle className="h-4 w-4" />
                                            Document uploaded successfully!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleUpload} disabled={!selectedFile || isUploading} className="gap-2">
                                {isUploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        Upload
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

