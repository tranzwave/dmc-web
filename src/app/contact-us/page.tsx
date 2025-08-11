"use client"

import { useState } from "react"
import ContactFormPanel from "~/components/contactus/contactFormPanel"
import ContactInfoPanel from "~/components/contactus/contactInfoPanel"
import { Navbar } from "~/components/navbar/navBar"

export default function ContactPage() {
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div className="flex flex-col overflow-auto h-screen bg-gradient-to-br pb-8 from-[#e6f4f1] via-[#f2f9f8] to-[#ffffff]">
      <div className="sticky top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <div className="flex-1 container mx-auto py-10 px-6 md:px-10 mt-20">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide text-primary-green mb-12 select-none drop-shadow-md">
          Contact Us
        </h1>

        <div className="grid gap-12 lg:grid-cols-2">
          <ContactInfoPanel />
          <ContactFormPanel
            formSuccess={formSuccess}
            setFormSuccess={setFormSuccess}
            formError={formError}
            setFormError={setFormError}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        </div>
      </div>
    </div>
  )
}
