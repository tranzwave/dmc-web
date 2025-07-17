"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"

interface StatusNoteProps {
    type: "success" | "error"
    title: string
    message: string
}

export default function StatusNote({ type, title, message }: StatusNoteProps) {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <Alert
            className={`p-1 px-2 relative mb-4 transition-transform duration-300 ease-in-out ${
            isVisible ? "transform translate-y-0" : "transform -translate-y-full"
            } ${type === "success" ? "border-green-500" : "border-red-500"}`}
        >
            <div>
            <div className="relative flex flex-row gap-1 justify-start items-start">
                <div className="mt-[5px]">
                {type === "success" ? (
                    <CheckCircle2 className=" text-green-500" color="#22c55e" size={16} />
                ) : (
                    <AlertCircle className="text-red-500" color="#ef4444" size={16} />
                )}
                </div>
                <div className="flex flex-col gap-0">
                <AlertTitle className="ml-2 text-[16px] mt-0 pt-0">{title}</AlertTitle>
                <AlertDescription className="-mt-2 ml-2 text-[14px]">{message}</AlertDescription>
                </div>
                <div className="absolute top-0 right-0 p-1 hover:cursor-pointer" onClick={() => setIsVisible(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
                </div>
            </div>
            </div>
        </Alert>
    )
}

