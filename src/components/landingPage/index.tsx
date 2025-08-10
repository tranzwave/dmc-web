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
import FeaturesSection from "./featuresSection"
import SupportSection from './supportSection';

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
      <FeaturesSection />

      {/* Dashboard Preview */}
      <DashboardPreview />

      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>
      {/* Support Section */}
      <SupportSection />

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

