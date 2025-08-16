/**
 * StatsSection component displays key statistics with animations.
 *
 * @update 8/11/2025
 */
"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView, easeOut } from "framer-motion"
import { Users, Globe, Languages } from "lucide-react"

const stats = [
  { number: "50K+", label: "Active Users", icon: Users },
  { number: "100+", label: "Countries", icon: Globe },
  { number: "20+", label: "Languages", icon: Languages },
]

export default function StatsSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.3 }) 

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [inView, controls])

  return (
    <section className="py-20 bg-gradient-to-r from-[#e6f4f1] via-[#f2f9f8] to-[#ffffff]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.98 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.6, ease: "easeOut" },
            },
          }}
          initial="hidden"
          animate={controls}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            Powering the travel experiences industry
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto font-light leading-relaxed">
            Choose the perfect plan for your travel business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 gap-y-10 text-center">
          {stats.map(({ icon: Icon, number, label }, i) => (
            <StatItem key={i} Icon={Icon} number={number} label={label} delay={i * 0.3} />
          ))}
        </div>
      </div>
    </section >
  )
}

function useCountUp(target: string, start: boolean, duration = 1500) {
  const [count, setCount] = useState<string | number>(0)

  useEffect(() => {
    if (!start) {
      setCount(0)
      return
    }

    let startTimestamp: number | null = null
    const cleanTarget = Number(target.replace(/[K+,]/g, "")) || 0
    if (cleanTarget === 0) {
      setCount(target)
      return
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const value = Math.floor(progress * cleanTarget)
      setCount(value)
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setCount(target) // show original string (with + etc) after done
      }
    }

    requestAnimationFrame(step)
  }, [target, start, duration])

  return count
}

function StatItem({
  Icon,
  number,
  label,
  delay = 0,
}: {
  Icon: React.ComponentType<{ className?: string }>
  number: string
  label: string
  delay?: number
}) {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref) // triggers every time

  const [startCount, setStartCount] = useState(false)

  useEffect(() => {
    if (inView) {
      controls.start("visible")
      setStartCount(true)
    } else {
      controls.start("hidden")
      setStartCount(false)
    }
  }, [controls, inView])

  const animatedNumber = useCountUp(number, startCount, 1500)

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: easeOut },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="flex flex-col items-center max-w-xs mx-auto"
    >
      <div className="bg-[#287f71]/5 rounded-full p-5 mb-6">
        <Icon className="text-[#287f71] w-10 h-10 sm:w-12 sm:h-12" />
      </div>
      <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-2">{animatedNumber}</div>
      <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{label}</p>
    </motion.div>
  )
}
