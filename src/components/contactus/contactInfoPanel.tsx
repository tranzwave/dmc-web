/**
 * Contact Information Panel
 *
 * A panel displaying the contact information of the company.
 *
 * @created 8/10/2025
 * @updated 8/10/2025
 */
"use client"

import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactInfoPanel() {
  const infoItems = [
    {
      Icon: MapPin,
      title: "Our Address",
      content: (
        <a
          href="https://www.google.com/maps/search/?api=1&query=7/A,+Deanston+Place,+Colombo+03,+Sri+Lanka"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 text-sm leading-relaxed hover:underline"
        >
          Tranzwave Ceylon Tours & Travels (Pvt) Ltd
          <br />
          7/A, Deanston Place, Colombo 03
          <br />
          Sri Lanka
        </a>
      ),
    },
    {
      Icon: Phone,
      title: "Phone",
      content: (
        <a
          href="tel:+94771414562"
          className="text-gray-600 text-sm leading-relaxed hover:underline"
        >
          +94 77 141 4562
        </a>
      ),
    },
    {
      Icon: Mail,
      title: "Email",
      content: (
        <a
          href="mailto:info@coord.travel"
          className="text-gray-600 text-sm leading-relaxed hover:underline"
        >
          info@coord.travel
        </a>
      ),
    },
    {
      Icon: Clock,
      title: "Business Hours",
      content: (
        <ul className="text-gray-600 text-sm leading-relaxed list-disc list-inside space-y-1">
          <li>Monday - Friday: 9am - 5pm</li>
          <li>Saturday: 10am - 2pm</li>
          <li>Sunday: Closed</li>
        </ul>
      ),
    },
  ]

  return (
    <section
      aria-label="Contact Information"
      className="p-10 pt-12 rounded-3xl bg-white/20 backdrop-blur-[30px] border border-white/25 shadow-xl hover:shadow-2xl hover:shadow-primary-green/20 flex flex-col space-y-10">
      <p className="text-lg font-medium text-gray-700 leading-relaxed">
        We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
      </p>

      <div className="space-y-8">
        {infoItems.map(({ Icon, title, content }) => (
          <div key={title} className="flex items-start gap-5">
            <Icon className="h-8 w-8 text-primary-green shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-primary-green text-lg">{title}</h3>
              <div>{content}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
