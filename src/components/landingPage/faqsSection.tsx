/**
 * Frequently Asked Questions Section
 *
 * @update 8/11/2025
 */
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useInView, useAnimation, easeOut, easeInOut } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How can I contact customer support?",
    answer:
      "You can contact us via the contact form on the Contact Us page, or email us directly at info@coord.travel. We're here to help!",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Refunds are processed within 14 days of your request. Please review our refund policy page for detailed information.",
  },
  {
    question: "Can I change my booking dates?",
    answer:
      "Yes, changes to booking dates are possible depending on availability. Contact our support team for assistance.",
  },
  {
    question: "Do you offer group discounts?",
    answer:
      "We offer special discounts for groups of 10 or more. Please get in touch to learn more.",
  },
  {
    question: "How do I subscribe to your newsletter?",
    answer:
      "You can subscribe by entering your email address in the newsletter subscription box at the bottom of our homepage.",
  },
]

export default function FaqsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  const headingRef = useRef(null)
  const headingControls = useAnimation()
  const headingInView = useInView(headingRef, { once: false, amount: 0.3 })

  useEffect(() => {
    if (headingInView) headingControls.start("visible")
    else headingControls.start("hidden")
  }, [headingInView, headingControls])

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  }

  return (
    <div className="min-h-auto bg-gradient-to-r from-[#e6f4f1] via-[#f2f9f8] to-[#ffffff] pt-16 sm:pt-10 pb-32 px-4 sm:px-6 md:px-10">
      <motion.div
        ref={headingRef}
        className="max-w-3xl mx-auto mb-12 text-center sm:mb-12"
        initial="hidden"
        animate={headingControls}
        variants={headingVariants}
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 select-none">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-700 font-light leading-relaxed">
          Find answers to the most common questions about our services and policies.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-4 py-2 sm:pb-8 mb-2">
        {faqs.map(({ question, answer }, index) => {
          const ref = useRef(null)
          const isInView = useInView(ref, { once: false, amount: 0.2 })

          return (
            <motion.div
              key={index}
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
              className={`bg-white/60 backdrop-blur-[20px] border border-white/30 rounded-2xl shadow-md cursor-pointer select-none
                ${openIndex === index ? "shadow-lg scale-[1.02]" : "shadow-md scale-100"}
              `}
              onClick={() => toggle(index)}
              layout
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  toggle(index)
                }
              }}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
              aria-labelledby={`faq-question-${index}`}
            >
              <div className="flex justify-between items-center px-6 py-4">
                <h3
                  id={`faq-question-${index}`}
                  className="text-lg font-semibold text-primary-green"
                >
                  {question}
                </h3>
                <motion.div
                  className="text-primary-green"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: easeInOut }}
                >
                  <ChevronDown size={24} />
                </motion.div>
              </div>

              <AnimatePresence initial={false} mode="wait">
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: {
                        opacity: 1,
                        height: "auto",
                        paddingTop: 8,
                        paddingBottom: 16,
                        scaleY: 1,
                        transition: {
                          opacity: { duration: 0.35, ease: "easeInOut", delay: 0.1 },
                          height: { duration: 0.35, ease: "easeInOut", delay: 0.1 },
                          paddingTop: { duration: 0.35, ease: "easeInOut", delay: 0.1 },
                          paddingBottom: { duration: 0.35, ease: "easeInOut", delay: 0.1 },
                          scaleY: { duration: 0.35, ease: "easeInOut", delay: 0.1 },
                        },
                      },
                      collapsed: {
                        opacity: 0,
                        height: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        scaleY: 0.95,
                        transition: {
                          opacity: { duration: 0.3, ease: "easeInOut" },
                          height: { duration: 0.3, ease: "easeInOut" },
                          paddingTop: { duration: 0.3, ease: "easeInOut" },
                          paddingBottom: { duration: 0.3, ease: "easeInOut" },
                          scaleY: { duration: 0.3, ease: "easeInOut" },
                        },
                      },
                    }}
                    className="px-6 text-gray-700 overflow-hidden origin-top"
                    style={{ willChange: "transform, opacity, height, padding" }}
                    layout
                  >
                    {answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
