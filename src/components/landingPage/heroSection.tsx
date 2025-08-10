/**
 * Hero Section
 *
 * This section showcases the hero content of the landing page.
 * 
 * @update 8/10/2025
 */
"use client"

import { ArrowRight, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { motion, useAnimation, useInView, easeOut } from "framer-motion"
import { useEffect, useRef } from "react"

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [inView, controls])

  const variantsLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
  }

  const variantsRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: easeOut } },
  }

  return (
    <section
      ref={ref}
      className="relative min-h-[70vh] md:min-h-screen pt-20 flex flex-col md:flex-row items-center justify-center mb-24 px-4 md:px-8 lg:px-16"
    >
      {/* Background + Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#287f71]/80 via-[#1f6c63]/60 to-[#287f71]/30 backdrop-blur-sm" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-7xl w-full mx-auto gap-12">
        {/* Text Content with motion */}
        <motion.div
          className="flex-1 max-w-xl text-center md:text-left text-white"
          variants={variantsLeft}
          initial="hidden"
          animate={controls}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] select-none leading-tight">
            Modern Platform For{' '}
            <span className="block text-primary-green tracking-normal text-[44px] md:text-[58px] drop-shadow-[0_6px_12px_rgba(43,200,166,0.8)] leading-none">
              Travel Management
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-8 font-light drop-shadow-md">
            Your one-stop solution for managing all your guests. Provide seamless journeys to your clients with our comprehensive platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center md:justify-start gap-4">
            <Link href="/dashboard/overview" passHref>
              <Button
                size="lg"
                className="relative rounded-lg bg-white/15 backdrop-blur-[20px] border border-white/30 text-white font-semibold
                 px-6 py-2.5 sm:px-10 sm:py-3 md:px-14 md:py-5
                 shadow-[0_8px_32px_rgba(43,200,166,0.15)]
                 hover:bg-white/25 hover:shadow-[0_12px_40px_rgba(43,200,166,0.3)]
                 active:bg-white/30
                 transition duration-300 ease-in-out
                 transform hover:scale-[1.04]
                 focus:outline-none focus:ring-2 focus:ring-[#2bc8a6] focus:ring-offset-1
                 flex items-center gap-2 sm:gap-3 group"
              >
                Get Started
                <ArrowRight size={18} />
              </Button>
            </Link>

            <Link href="/contact-us" target="_blank" rel="noopener noreferrer" passHref>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent shadow-sm hover:shadow-md
                 transition
                 px-5 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4
                 flex items-center gap-1.5 sm:gap-2"
              >
                <Calendar size={16} />
                Book a Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Image with motion */}
        <motion.div
          className="flex-1 max-w-4xl overflow-hidden hover:shadow-3xl transition-shadow duration-500 rounded-xl"
          variants={variantsRight}
          initial="hidden"
          animate={controls}
          whileHover={{ scale: 1.02 }}
        >
          <Image
            src="/assets/landing/landing-ss.webp"
            alt="System screenshot"
            width={1280}
            height={720}
            priority
            className="rounded-xl"
          />
        </motion.div>
      </div>
    </section>
  )
}
