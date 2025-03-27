"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { useToast } from "~/hooks/use-toast"
import { Navbar } from "~/components/landingPage/navBar"

export default function ContactPage() {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })
    const [formSuccess, setFormSuccess] = useState(false)
    const [formError, setFormError] = useState("")

    const handleChange = (e: any) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError("");
        setFormSuccess(false);
    
        // Validate required fields
        const requiredFields: (keyof typeof formData)[] = ["firstName", "lastName", "email", "subject", "message"];
        const missingFields = requiredFields.filter((field) => !formData[field]);
    
        if (missingFields.length > 0) {
            setFormError("Please fill in all required fields");
            setIsSubmitting(false);
            return;
        }
    
        try {
            // Send data to the backend API
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                throw new Error("Failed to submit form");
            }
    
            // Parse the response
            const result = await response.json();
    
            // Show success message
            setFormSuccess(true);
            toast({
                title: "Message sent!",
                description: result.message || "We'll get back to you as soon as possible.",
            });
    
            // Reset form fields
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            console.error("Form submission error:", error);
            setFormError("There was a problem submitting your message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <div className="flex flex-col min-h-screen overflow-y-auto">
            <Navbar />
            <div className="container mx-auto py-12 px-4 md:px-6 mt-20">
                <h1 className="text-3xl font-bold tracking-tight text-primary-green">Contact Us</h1>
                <div className="grid gap-10 lg:grid-cols-2">
                    <div className="space-y-6">
                        <div>
                            <p className="mt-2 text-muted-foreground">
                                We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <MapPin className="h-5 w-5 text-primary-green shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Our Address</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Tranzwave Ceylon Tours & Travels (Pvt) Ltd
                                        <br />
                                        7/A, Deanston Place, Colombo 03
                                        <br />
                                        Sri Lanka
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Phone className="h-5 w-5 text-primary-green shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Phone</h3>
                                    <p className="text-sm text-muted-foreground">+94 77 141 4562</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Mail className="h-5 w-5 text-primary-green shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Email</h3>
                                    <p className="text-sm text-muted-foreground"> info@coord.travel</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Clock className="h-5 w-5 text-primary-green shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Business Hours</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Monday - Friday: 9am - 5pm
                                        <br />
                                        Saturday: 10am - 2pm
                                        <br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* <div className="rounded-lg overflow-hidden border h-64">
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground text-sm">Map placeholder</p>
                            </div>
                        </div> */}
                    </div>

                    <div>
                        {formSuccess ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6 h-full flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-primary-green"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium mb-2">Thank You!</h3>
                                <p className="text-muted-foreground mb-6">
                                    Your message has been sent successfully. We'll get back to you soon.
                                </p>
                                <Button onClick={() => setFormSuccess(false)} variant="outline">
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {formError && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{formError}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First name</Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last name</Label>
                                            <Input id="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john.doe@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone (optional)</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="(123) 456-7890"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input
                                            id="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="How can we help you?"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Please provide as much detail as possible..."
                                            className="min-h-[120px]"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

