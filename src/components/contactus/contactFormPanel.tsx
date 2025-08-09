/**
 * Contact Form Panel
 *
 * A panel for users to submit their contact information and messages.
 *
 * @created 8/10/2025
 * @updated 8/10/2025
 */
"use client"

import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { useToast } from "~/hooks/use-toast"

type FormData = {
    firstName: string
    lastName: string
    email: string
    phone: string
    subject: string
    message: string
}

type Props = {
    formSuccess: boolean
    setFormSuccess: React.Dispatch<React.SetStateAction<boolean>>
    formError: string
    setFormError: React.Dispatch<React.SetStateAction<string>>
    isSubmitting: boolean
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ContactFormPanel({
    formSuccess,
    setFormSuccess,
    formError,
    setFormError,
    isSubmitting,
    setIsSubmitting,
}: Props) {
    const { toast } = useToast()
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setFormError("")
        setFormSuccess(false)

        const requiredFields: (keyof FormData)[] = [
            "firstName",
            "lastName",
            "email",
            "subject",
            "message",
        ]
        const missingFields = requiredFields.filter((field) => !formData[field])
        if (missingFields.length > 0) {
            const errorMsg = "Please fill in all required fields"
            setFormError(errorMsg)
            toast({
                title: "Error",
                description: errorMsg,
                variant: "destructive",
            })
            setIsSubmitting(false)
            return
        }

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!response.ok) throw new Error("Failed to submit form")
            const result = await response.json()

            setFormSuccess(true)
            toast({
                title: "Message sent!",
                description: result.message || "We'll get back to you as soon as possible.",
            })

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            })
        } catch (error) {
            console.error("Form submission error:", error)
            const errorMsg = "There was a problem submitting your message. Please try again."
            setFormError(errorMsg)
            toast({
                title: "Submission Failed",
                description: errorMsg,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (formError) {
            const timer = setTimeout(() => {
                setFormError("")
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [formError, setFormError])

    return (
 <section
      aria-label="Contact Information"
      className="p-10 rounded-3xl bg-white/20 backdrop-blur-[30px] border border-white/25 shadow-xl hover:shadow-2xl hover:shadow-primary-green/20 flex flex-col space-y-10">
     
            {formSuccess ? (
                <div className="flex flex-col items-center justify-center text-center space-y-6 h-full">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center drop-shadow-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-primary-green"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-primary-green select-none">Thank You!</h3>
                    <p className="text-gray-600 max-w-xs select-text">
                        Your message has been sent successfully. We'll get back to you soon.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => setFormSuccess(false)}
                        className="mt-4 px-8 py-3 rounded-full font-semibold tracking-wide shadow-md hover:shadow-lg transition"
                    >
                        Send Another Message
                    </Button>
                </div>
            ) : (
                <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                    {/* No inline error alert */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="firstName" className="font-semibold text-primary-green">
                                First name
                            </Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                required
                                className="rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-green"
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="lastName" className="font-semibold text-primary-green">
                                Last name
                            </Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                required
                                className="rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-green"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="email" className="font-semibold text-primary-green">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john.doe@example.com"
                            required
                            className="rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-green"
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="phone" className="font-semibold text-primary-green">
                            Phone (optional)
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="(123) 456-7890"
                            className="rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-green"
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="subject" className="font-semibold text-primary-green">
                            Subject
                        </Label>
                        <Input
                            id="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="How can we help you?"
                            required
                            className="rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-green"
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="message" className="font-semibold text-primary-green">
                            Message
                        </Label>
                        <Textarea
                            id="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Please provide as much detail as possible..."
                            className="min-h-[140px] rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-green resize-none"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 px-8 bg-[#287f71]/90 backdrop-blur-xl border border-white/40 rounded-full text-white font-semibold shadow-md hover:shadow-lg hover:bg-[#238373] transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                </form>
            )}
        </section>
    )
}
