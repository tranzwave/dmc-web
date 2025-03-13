import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { db } from "~/server/db"
import { updateDriverDocumentURL } from "~/server/db/queries/transport"
import { del } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentType = formData.get("documentType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.includes("pdf")) {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    // Create a unique filename with document type prefix
    const filename = `${documentType}-${Date.now()}-${file.name}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public", // Make it private for security
    })

    // Save to database
    if(formData.get("entityId") && formData.get("entityType")) {
        if(formData.get("entityType") === "driver") {
            const driverId = formData.get("entityId") as string
            const response = await updateDriverDocumentURL(driverId, documentType, blob.url)
            if (!response) {
                return NextResponse.json({ error: "Update failed" }, { status: 500 })
            }
        } else if (formData.get("entityType") === "guide") {
            const guideId = formData.get("entityId") as string
            //TODO
        } else if (formData.get("entityType") === "vehicle") {
            const vehicleId = formData.get("entityId") as string
            //TODO
        }
    }

    return NextResponse.json(blob)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}


 
export async function DELETE(request: Request) {
    try {
        const formData = await request.formData()
        const urlToDelete = formData.get("url") as string

        if (!urlToDelete) {
            return NextResponse.json({ error: "No URL provided" }, { status: 400 })
        }

        // Delete from Vercel Blob

        await del(urlToDelete)

        // Save to database
        if(formData.get("entityId") && formData.get("entityType")) {
            if(formData.get("entityType") === "driver") {
                const driverId = formData.get("entityId") as string
                const documentType = formData.get("documentType") as string
                const response = await updateDriverDocumentURL(driverId, documentType, null)
                if (!response) {
                    return NextResponse.json({ error: "Update failed" }, { status: 500 })
                }
            } else if (formData.get("entityType") === "guide") {
                const guideId = formData.get("entityId") as string
                //TODO
            } else if (formData.get("entityType") === "vehicle") {
                const vehicleId = formData.get("entityId") as string
                //TODO
            }

        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("Delete error:", error)
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }

}

