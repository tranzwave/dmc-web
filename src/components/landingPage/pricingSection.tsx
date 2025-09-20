/**
 * Pricing Section
 *
 * @update 8/10/2025
 */
"use client"

import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { packages } from "~/lib/constants"
import { Card } from "../ui/card"
import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef } from "react"

export default function PricingSection() {
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const controls = packages.map(() => useAnimation())

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto font-light leading-relaxed">
            Choose the perfect plan for your travel business needs
          </p>
        </div>

        <div className="grid px-4 md:px-6 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-full mx-auto justify-center">
          {packages.map((plan, i) => (
            <PricingCard
              key={i}
              plan={plan}
              delay={i * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Separate component for each card to handle its own animation & ref
function PricingCard({ plan, delay }: { plan: typeof packages[0], delay: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 })
    } else {
      controls.start({ opacity: 0, y: 20 })
    }
  }, [inView, controls])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    >
      <Card
        className={`cursor-pointer p-6 w-[320px] h-auto flex flex-col justify-between rounded-2xl bg-white/20 backdrop-blur-[24px] border border-white/40 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out ${
          plan.tabValue === "plus" ? "ring-2 ring-[#2bc8a6] relative" : ""
        }`}
      >
        {plan.tabValue === "plus" && (
          <span className="absolute top-0 right-0 bg-[#2bc8a6] text-white px-4 py-1 text-sm rounded-bl-lg rounded-tr-2xl select-none">
            🌟 Popular
          </span>
        )}
        <div>
          <h3 className="text-2xl font-extrabold mb-2 text-gray-900">{plan.name}</h3>
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#2bc8a6]">${plan.price}</span>
            <span className="text-gray-700 text-sm font-medium">/month</span>
          </div>
          <p className="text-gray-700 mb-8 font-light leading-relaxed">{plan.description}</p>
          <div className="space-y-2 mb-8">
            {plan.features.map((feature, j) => (
              <div key={j} className="flex items-center gap-2 text-gray-800 text-sm">
                <Check className="text-[#2bc8a6] min-w-4" size={16} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          {plan.tabValue === "enterprise" ? (
            <Link href="/contact-us" target="_blank" rel="noopener noreferrer">
              <Button className="w-full rounded-xl bg-[#2bc8a6]/90 hover:bg-[#2bc8a6]/100 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-white font-semibold">
                Contact Sales
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/sign-up" passHref>
              <Button className="w-full rounded-xl bg-[#2bc8a6]/90 hover:bg-[#2bc8a6]/100 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-white font-semibold">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
