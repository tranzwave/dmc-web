'use client'
import { Navbar } from "./navBar"
import HeroSection from "./heroSection"
import PricingSection from "./pricingSection"
import DashboardPreview from "./dashboardPreview"
import FeaturesSection from "./featuresSection"
import SupportSection from './supportSection';
import StatsSection from "./statsSection"
import FocusOnGuestsSection from "./focusOnGuestsSection"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
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

      {/* Focus on Guests Section */}
      <div className="px-4">
        <FocusOnGuestsSection className="px-4 sm:px-8"/>
      </div>

      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>
      {/* Support Section */}
      <SupportSection />

      {/* Stats Section */}
      <StatsSection />

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

