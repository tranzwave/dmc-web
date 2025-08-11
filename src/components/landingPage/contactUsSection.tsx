/**
 * Contact Us Section
 *
 * @update 8/11/2025
 */
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import ContactFormPanel from "~/components/contactus/contactFormPanel"
import ContactInfoPanel from "~/components/contactus/contactInfoPanel"

export default function ContactUsSection() {
    const [formSuccess, setFormSuccess] = useState(false)
    const [formError, setFormError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Animation controls for heading
    const headingControls = useAnimation()
    const headingRef = useRef(null)
    const headingInView = useInView(headingRef, { amount: 0.3 })

    useEffect(() => {
        if (headingInView) {
            headingControls.start("visible")
        } else {
            headingControls.start("hidden")
        }
    }, [headingInView, headingControls])

    return (
        <div className="flex bg-gray-50 flex-col min-h-screen p-12 sm:p-14 sm:pb-24">
            <div className="flex-1 container mx-auto py-5 px-4 sm:px-6 md:px-10 mt-5">
                {/* Title with scroll animation (bi-directional) */}
                <motion.div
                    ref={headingRef}
                    className="text-center mb-16"
                    initial="hidden"
                    animate={headingControls}
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6, ease: "easeOut" },
                        },
                    }}
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                        Contact Us
                    </h2>
                    <p className="text-gray-700 max-w-2xl mx-auto font-light leading-relaxed">
                        Whether you have questions or want to discuss your needs, please don’t hesitate to contact us.
                    </p>

                </motion.div>

                {/* Grid with staggered motion (bi-directional) */}
                <motion.div
                    className="flex flex-col gap-8 sm:gap-12 px-4 sm:px-20 md:px-28"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.2 }} // allow re-trigger
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.2 } },
                    }}
                >
                    {/* Left Panel */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: -40 },
                            show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
                        }}
                    >
                        <ContactInfoPanel />
                    </motion.div>

                    {/* Right Panel */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: 40 },
                            show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
                        }}
                    >
                        <ContactFormPanel
                            formSuccess={formSuccess}
                            setFormSuccess={setFormSuccess}
                            formError={formError}
                            setFormError={setFormError}
                            isSubmitting={isSubmitting}
                            setIsSubmitting={setIsSubmitting}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
