/**
 * Contact Information Panel
 *
 * A panel displaying the contact information of the company.
 *
 * @created 8/10/2025
 * @updated 8/11/2025
 */
"use client"

import { Phone, Mail } from "lucide-react"
import { easeOut, motion, useAnimation, useInView } from "framer-motion"
import { useRef, useEffect } from "react"

export default function ContactInfoPanel() {
  const infoItems = [
    {
      Icon: Phone,
      title: "Phone",
      content: (
        <a
          href="tel:+94771414562"
          className="text-gray-600 text-sm leading-relaxed hover:underline"
        >
          +94 77 141 4562
        </a>
      ),
    },
    {
      Icon: Mail,
      title: "Email",
      content: (
        <a
          href="mailto:info@coord.travel"
          className="text-gray-600 text-sm leading-relaxed hover:underline"
        >
          info@coord.travel
        </a>
      ),
    },
  ]

  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.3 }) // no once: true, so fires on enter and leave
  const controls = useAnimation()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [inView, controls])

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  }

  return (
    <motion.section
      ref={ref}
      aria-label="Contact Information"
      className="p-12 pt-14 rounded-3xl bg-white/20 backdrop-blur-[30px] border border-white/25 shadow-xl hover:shadow-2xl hover:shadow-primary-green/20 flex flex-col space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate={controls} // control animation state manually
    >
      <motion.p className="text-lg font-medium text-gray-700 leading-relaxed" variants={itemVariants}>
        We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
      </motion.p>

      <motion.div className="space-y-8">
        {infoItems.map(({ Icon, title, content }) => (
          <motion.div
            key={title}
            className="flex items-start gap-5"
            variants={itemVariants}
          >
            <Icon className="h-8 w-8 text-primary-green shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-primary-green text-lg">{title}</h3>
              <div>{content}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
