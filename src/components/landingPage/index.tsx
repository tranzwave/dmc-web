/**
 * Landing Page
 *
 * @update 8/11/2025
 */

'use client'
import { Navbar } from "../navbar/navBar"
import HeroSection from "./heroSection"
import PricingSection from "./pricingSection"
import DashboardPreview from "./dashboardPreview"
import FeaturesSection from "./featuresSection"
import SupportSection from './supportSection';
import StatsSection from "./statsSection"
import FocusOnGuestsSection from "./focusOnGuestsSection"
import ContactUsSection from "./contactUsSection"
import FaqsSection from "./faqsSection"
import { Footer } from "../footer/footer"
import TermsConditionSection from "./termsConditionSection"
import FeatureSplit from "./featureSplit"
import { Calendar, Monitor, Save } from "lucide-react"
import FourStepProcess from "./fourStepProcess"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
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

      <FeatureSplit
        eyebrow=""
        title="Free Itinerary Builder"
        intro="our new itinerary builder is an entirely new experience for creating itineraries quickly for your customized / bespoke tours. with features like auto save and reusable days, you can move swiftly across screens and get the work done in no time!"
        imageSrc="/assets/landing/booking.png" // put your image in /public/images
        imageAlt="Landing screenshot"
        bullets={[
          {
            icon: <Calendar className="h-7 w-7" />,
            title: "Reusable Days",
            description:
              "Add used days from previous itineraries, including photos, description and activities.",
          },
          {
            icon: <Monitor className="h-7 w-7" />,
            title: "Itinerary Versioning",
            description:
              "Create and manage itinerary versions as your discussion with the customer evolves.",
          },
          {
            icon: <Save className="h-7 w-7" />,
            title: "Easy to Use",
            description:
              "Toursoft is the easiest to use product on the market. Breeze through creating complex itineraries with ease!",
          },
        ]}
      />

      {/* Dashboard Preview */}
      <DashboardPreview />

      {/* Focus on Guests Section */}
      <div className="px-4">
        <FocusOnGuestsSection className="px-4 sm:px-8" />
      </div>

      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* Four Step Process */}
      <FourStepProcess />

      {/* Support Section */}
      <SupportSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Contact Us Section */}
      <div id="contact-us">
        <ContactUsSection />
      </div>

      <div id="faqs">
        <FaqsSection />
      </div>

      {/* Terms and Conditions Section */}
      <div id="terms-and-conditions">
        <TermsConditionSection />
      </div>

      {/* Footer */}
    </div>
  )
}

