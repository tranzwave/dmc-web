/**
 * Focus on Guests Section
 *
 * @update 8/10/2025
 */
"use client"

import React, { useEffect, useRef } from "react"
import { motion, type Variants, useAnimation, useInView } from "framer-motion"
import { Button } from "../ui/button"

// === Motion helpers ===
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

const staggerList: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

// === Reusable "replay on scroll" wrappers ===
function ReplayOnScroll({
  children,
  className = "",
  variants,
  amount = 0.25,
}: {
  children: React.ReactNode
  className?: string
  variants: Variants
  amount?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, {
    amount,
    // Trigger a bit earlier so it feels snappier
    margin: "0px 0px -10% 0px",
  })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) controls.start("visible")
    else controls.start("hidden")
  }, [inView, controls])

  return (
    <motion.div ref={ref} className={className} variants={variants} initial="hidden" animate={controls}>
      {children}
    </motion.div>
  )
}

function StaggerParent({
  children,
  className = "",
  delay = 0,
  amount = 0.25,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  amount?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { amount, margin: "0px 0px -10% 0px" })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) controls.start("visible")
    else controls.start("hidden")
  }, [inView, controls])

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: delay } } }}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  )
}

function FadeUp({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <ReplayOnScroll className={className} variants={fadeUp}>
      {children}
    </ReplayOnScroll>
  )
}

function PopIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <ReplayOnScroll className={className} variants={popIn}>
      {children}
    </ReplayOnScroll>
  )
}

export default function FocusOnGuestsSection({ className = "" }: { className?: string }) {
  return (
    <section className={cn("w-full bg-white px-4 sm:px-6 lg:px-8", className)}>
      <div className="max-w-7xl mx-auto grid items-center gap-12 lg:grid-cols-2">
        {/* Left copy */}
        <StaggerParent className="max-w-2xl">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl font-semibold leading-tight tracking-tight text-gray-900">
              Focus on guests, not <span className="block sm:inline">spreadsheets</span>
            </h2>
          </FadeUp>

          <FadeUp>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Pull all bookings into a central system to automatically manage availability, free you from admin and
              prevent double bookings so you can focus on what you do best.
            </p>
          </FadeUp>

          <motion.ul className="mt-8 space-y-6" variants={staggerList}>
            <Feature
              title="Automate confirmations, updates, and cancellations"
              desc="for guests and guides. Email guests easily with Bókun's templates"
              href="#"
            />
            <Feature
              title="Enable sales channels easily and use our pricing tools"
              desc="to set bespoke rates for each sales channel"
              href="#"
            />
            <Feature
              title="Avoid double bookings with one booking calendar"
              desc="a sales feed and mass closeouts."
              href="#"
            />
          </motion.ul>

          <FadeUp>
            <div className="mt-8">
              <Button className="w-full rounded-xl bg-[#2bc8a6]/90 hover:bg-[#2bc8a6]/100 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-white font-semibold">
                Manage and Track
              </Button>
            </div>
          </FadeUp>
        </StaggerParent>

        {/* Right visuals */}
        <StaggerParent className="relative -mx-2 lg:mx-0" delay={0.15}>
          {/* Back plate */}
          <ReplayOnScroll
            className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-gray-50 to-white"
            variants={fadeUp}
            children={undefined}
          />

          {/* Card: Upcoming departures */}
          <PopIn className="relative ml-auto w-[86%] max-w-md rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/40">
            <div className="p-4">
              <div className="text-sm font-medium text-gray-900">Upcoming departures</div>
              <div className="mt-3 space-y-3 text-sm">
                <Row time="10:00" label="Cooking class" />
                <Row time="12:00" label="Transport from Heathrow" />
              </div>
              <div className="mt-3 text-xs text-emerald-600 font-medium">Booking Calendar</div>
            </div>
          </PopIn>

          {/* Card: Bookings bar chart */}
          <PopIn className="relative -mt-8 rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 lg:-mr-6 lg:translate-x-10">
            <div className="w-[680px] max-w-full p-5">
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Your bookings</p>
                  <p className="text-xs text-gray-500">Apr 8 – May 12</p>
                </div>
                <Legend />
              </header>

              <div className="mt-5">
                <BarChart />
              </div>
            </div>
          </PopIn>

          {/* Card: KPI strip */}
          <PopIn className="relative -mt-6 w-[640px] max-w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
            <div className="grid grid-cols-3 gap-4">
              <KPI label="Bookings" value="72" />
              <KPI label="Passengers" value="145" />
              <KPI label="Booking Value" value="USD 12.4k" />
            </div>
          </PopIn>
        </StaggerParent>
      </div>
    </section>
  )
}

function Feature({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <motion.li className="flex items-start gap-4" variants={fadeUp}>
      <SeedIcon className="mt-1" />
      <div>
        <p className="text-base font-medium text-gray-900">{title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span>{desc}</span>
          <a href={href} className="shrink-0 text-emerald-700 hover:underline">
            View more
          </a>
        </div>
      </div>
    </motion.li>
  )
}

function SeedIcon({ className = "" }: { className?: string }) {
  return (
    <span className={cn("inline-flex h-6 w-6 items-center justify-center", className)} aria-hidden>
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <path d="M12 3c3 2.5 5 5.5 5 8.2 0 3.3-2.7 5.8-5 6.8-2.3-1-5-3.5-5-6.8C7 8.5 9 5.5 12 3Z" fill="url(#g)" />
      </svg>
    </span>
  )
}

function Row({ time, label }: { time: string; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-2">
      <div className="text-xs text-gray-500">{time}</div>
      <div className="text-sm font-medium text-sky-700">{label}</div>
    </div>
  )
}

function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs text-gray-600">
      <span className="inline-flex items-center gap-1">
        <span className="inline-block h-2 w-2 rounded-sm bg-gray-800" /> Online Sales
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="inline-block h-2 w-2 rounded-sm bg-gray-300" /> Manual bookings
      </span>
    </div>
  )
}

function BarChart() {
  const weeks = [
    { online: 65, manual: 110 },
    { online: 0, manual: 190 },
    { online: 15, manual: 85 },
    { online: 8, manual: 60 },
  ]

  return (
    <div className="h-56 w-full border-t border-gray-100 pt-6">
      <motion.div className="flex h-full items-end justify-between" variants={staggerList}>
        {weeks.map((w, i) => (
          <motion.div key={i} className="flex w-[18%] items-end justify-center gap-1" variants={fadeUp}>
            <span
              className="inline-block w-3 rounded-sm bg-gray-800/90"
              style={{ height: `${w.online}px` }}
              aria-hidden
              title={`Online sales: ${w.online}`}
            />
            <span
              className="inline-block w-6 rounded-sm bg-gray-300"
              style={{ height: `${w.manual}px` }}
              aria-hidden
              title={`Manual bookings: ${w.manual}`}
            />
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-3 flex justify-between text-[10px] text-gray-500 select-none">
        <span>Week 15</span>
        <span>Week 16</span>
        <span>Week 17</span>
        <span>Week 18</span>
      </div>
    </div>
  )
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <motion.div className="rounded-xl border border-gray-100 p-4" variants={fadeUp}>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      <div className="mt-3 h-6 w-full overflow-hidden">
        <svg viewBox="0 0 120 24" className="h-6 w-full" aria-hidden="true">
          <path d="M0 18 C 20 4, 40 22, 60 8 S 100 20, 120 10" fill="none" stroke="#D1D5DB" strokeWidth="3" />
        </svg>
      </div>
    </motion.div>
  )
}

// Minimal cn utility (if you don't have one)
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}
