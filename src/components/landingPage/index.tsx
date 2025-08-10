'use client'
import Image from "next/image"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { ArrowRight, Check, Globe, Users, Calendar } from 'lucide-react'
import { Navbar } from "./navBar"
import { packages } from "~/lib/constants"
import HeroSection from "./heroSection"
import PricingSection from "./pricingSection"
import DashboardPreview from "./dashboardPreview"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <HeroSection />
      {/* Screenshot Section */}

      {/* Logos Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {[...Array(6)].map((_, i) => (
              <Image
                key={i}
                src="/placeholder-logo.svg"
                alt={`Client logo ${i + 1}`}
                width={120}
                height={40}
                className="opacity-50 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" id="features">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Platform Your Travel Business Will Love
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Streamline your operations, enhance guest experiences, and grow your business with our comprehensive travel management solution.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Reach",
                description: "Connect with travelers worldwide and manage bookings across different time zones effortlessly.",
              },
              {
                icon: Users,
                title: "Guest Management",
                description: "Keep track of guest preferences, history, and special requests in one centralized platform.",
              },
              {
                icon: Calendar,
                title: "Smart Scheduling",
                description: "Automated scheduling and calendar management to optimize your bookings and availability.",
              },
            ].map((feature, i) => (
              <Card key={i} className="p-6">
                <feature.icon className="w-12 h-12 text-[#287f71] mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <DashboardPreview />

      {/* Pricing Section */}
      <PricingSection />

      {/* Stats Section */}
      <section className="py-20 bg-[#287f71] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: "50k+", label: "Active Users" },
              { number: "100+", label: "Countries" },
              { number: "20+", label: "Languages" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-teal-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mt-4 flex justify-center space-x-6 text-[13px]">
            <a href="/terms-and-conditions" className="hover:underline">Terms & Conditions</a>
            <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
            <a href="/refund-policy" className="hover:underline">Refund Policy</a>
          </div>
          <p>© 2025 COORD.TRAVEL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

