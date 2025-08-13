/**
 * Feature Section
 *
 * Smooth scroll-trigger animations
 * @created 8/10/2025
 */

import React from "react"
import { Globe, Users, Calendar, CreditCard, Box, Clock } from "lucide-react"
import { Card } from "../ui/card"
import { motion, type Variants, useAnimation, useInView } from "framer-motion"

const EASE_SMOOTH: [number, number, number, number] = [0.25, 1, 0.3, 1]

const fadeUpSmooth: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_SMOOTH },
  },
}

const staggerGridSmooth: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

function ReplayOnScroll({
  children,
  className,
  variants,
  amount = 0.25,
}: {
  children: React.ReactNode
  className?: string
  variants: Variants
  amount?: number
}) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { amount, margin: "0px 0px -10% 0px" })
  const controls = useAnimation()

  React.useEffect(() => {
    if (inView) controls.start("visible")
    else controls.start("hidden")
  }, [inView, controls])

  return (
    <motion.div ref={ref} className={className} variants={variants} initial="hidden" animate={controls}>
      {children}
    </motion.div>
  )
}

export default function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: "Expand Your Market",
      description: "Reach travelers worldwide with real-time availability and multi-currency support.",
    },
    {
      icon: Users,
      title: "Effortless Customer Management",
      description:
        "Centralize guest profiles, preferences, and booking history for personalized experiences.",
    },
    {
      icon: Calendar,
      title: "Automated Scheduling",
      description: "Optimize bookings and resources with smart calendar syncing and instant confirmations.",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Accept payments globally with integrated, secure, and flexible payment options.",
    },
    {
      icon: Box,
      title: "Inventory Control",
      description:
        "Manage your products and tours efficiently with real-time stock and availability tracking.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Reliable customer support to assist you and your guests anytime, anywhere.",
    },
  ]

  return (
    <section className="py-20 pt-5 sm:pt-20 px-2 bg-gray-50">
      <div className="container mx-auto px-4">
        <ReplayOnScroll className="text-center mb-16" variants={fadeUpSmooth} amount={0.3}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" id="features">
            The Platform Your Travel Business Will Love
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Streamline operations, enhance guest experiences, and scale your business with our
            all-in-one travel management solution.
          </p>
        </ReplayOnScroll>

        <ReplayOnScroll className="grid md:grid-cols-3 gap-8" variants={staggerGridSmooth} amount={0.2}>
          {features.map(({ icon: Icon, title, description }, i) => (
            <FeatureCard key={i} Icon={Icon} title={title} description={description} />
          ))}
        </ReplayOnScroll>
      </div>
    </section>
  )
}

function FeatureCard({
  Icon,
  title,
  description,
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
}) {
  return (
    <motion.div variants={fadeUpSmooth}>
      <Card className="p-6 flex flex-col items-center text-center bg-white rounded-xl border border-gray-200 shadow-sm transition duration-500 ease-in-out hover:shadow-lg hover:-translate-y-[2px] hover:scale-[1.005] hover:bg-gradient-to-br hover:from-white hover:via-[#e6f6f1]/60 hover:to-white cursor-pointer">
        <Icon className="w-14 h-14 text-[#287f71] mb-5" />
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </Card>
    </motion.div>
  )
}
