import Image from "next/image"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { ArrowRight, Check, Globe, Users, Calendar } from 'lucide-react'
import { Navbar } from "./navBar"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[90vh] pt-24 flex justify-center mb-24">
        <div className="absolute inset-0 z-0">
          <Image
        src="/placeholder.svg?height=1080&width=1920"
        alt="Misty forest background"
        layout="fill"
        className="object-cover"
        priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#287f71]/90 to-[#287f71]/40" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Modern Platform For
        <span className="block text-primary-green">Travel Management</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
        Your one-stop solution for managing all your guests. Provide seamless journeys to your clients with our comprehensive platform.
          </p>
          <div className="flex gap-4 justify-center mb-8">
        <Button size="lg" className="bg-white text-[#287f71] hover:bg-white/90">
          Get Started
        </Button>
        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
          Book a Demo
        </Button>
          </div>

          <div className="relative w-full max-w-4xl mx-auto">
        <Image
          src="/assets/landing/landing-ss.webp"
          alt="System screenshot"
          width={1280}
          height={720}
          priority
        />
          </div>
        </div>
      </section>
      {/* Screenshot Section */}

      {/* Logos Section */}
      <section className="py-16 bg-gray-50">
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
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
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
      <section className="py-20 bg-gradient-to-b from-[#287f71]/10 to-transparent">
        <div className="container mx-auto px-4">
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="/assets/landing/booking.png"
              alt="Dashboard preview"
              width={1280}
              height={720}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your travel business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$49",
                description: "Perfect for small travel agencies",
                features: ["Up to 100 bookings/month", "Basic guest management", "Email support"],
              },
              {
                name: "Professional",
                price: "$99",
                description: "Ideal for growing businesses",
                features: ["Unlimited bookings", "Advanced guest management", "Priority support", "API access"],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large-scale operations",
                features: ["Custom solutions", "Dedicated account manager", "24/7 phone support", "Custom integrations"],
              },
            ].map((plan, i) => (
              <Card key={i} className={`p-8 ${plan.popular ? 'ring-2 ring-[#287f71] relative' : ''}`}>
                {plan.popular && (
                  <span className="absolute top-0 right-0 bg-[#287f71] text-white px-4 py-1 text-sm rounded-bl-lg">
                    Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-gray-600">/month</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check className="text-[#287f71] w-5 h-5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-[#287f71] hover:bg-[#287f71]/90">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
          <p>© 2024 COORD.TRAVEL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

