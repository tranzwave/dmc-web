/**
 * Terms and Conditions Section Component
 * 
 * @update 8/11/2025
 */
"use client";
import { useRef, useState, useEffect } from "react";
import { easeIn, easeOut, motion, useAnimation, useInView } from "framer-motion";

export default function TermsConditionSection() {
    const [openSection, setOpenSection] = useState<number | null>(null);

    const toggleSection = (index: number) => {
        setOpenSection(openSection === index ? null : index);
    };

    const terms = [
        {
            title: "1. Acceptance of Terms",
            content: (
                <>
                    By accessing and using Coord.Travel, you agree to comply with and be bound by these Terms and Conditions.
                    If you do not agree with any part of these terms, you may not use the service.
                </>
            ),
        },
        {
            title: "2. Subscription and Payment",
            content: (
                <>
                    Our platform operates on a subscription-based model. By subscribing, you agree to pay all applicable fees associated with your chosen plan.
                    Failure to process payments may result in suspension or termination of access to the platform.
                </>
            ),
        },
        {
            title: "3. Use License",
            content: (
                <>
                    Subject to your compliance with these terms, we grant you a non-exclusive, non-transferable, and revocable license to use our platform
                    for managing DMC operations. Any misuse, resale, or unauthorized distribution of our software is strictly prohibited.
                </>
            ),
        },
        {
            title: "4. Data and Privacy",
            content: (
                <>
                    You retain ownership of all business data entered into the system. However, we may collect anonymized usage data for improving our services.
                    We implement appropriate security measures to protect your data but do not guarantee complete security.
                </>
            ),
        },
        {
            title: "5. Service Availability",
            content: (
                <>
                    We strive to maintain uptime and ensure seamless service. However, we do not guarantee uninterrupted availability.
                    Downtime due to maintenance, unforeseen technical issues, or third-party service disruptions may occur.
                </>
            ),
        },
        {
            title: "6. Disclaimer",
            content: (
                <>
                    Our platform is provided "as is" without warranties of any kind. We disclaim all warranties, including but not limited to
                    merchantability, fitness for a particular purpose, and non-infringement.
                </>
            ),
        },
        {
            title: "7. Limitation of Liability",
            content: (
                <>
                    We shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform,
                    including but not limited to loss of data, revenue, or business operations.
                </>
            ),
        },
        {
            title: "8. Modifications",
            content: (
                <>
                    We reserve the right to update or modify these Terms and Conditions at any time. Continued use of the platform
                    after modifications constitutes acceptance of the updated terms.
                </>
            ),
        },
    ];

    // Variants for scroll in/out animations
    const variants = {
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
        hidden: { opacity: 0, y: 30, transition: { duration: 0.6, ease: easeIn } },
    };

    const headingRef = useRef(null);
    const headingControls = useAnimation();
    const headingInView = useInView(headingRef, { once: false, amount: 0.3 });

    useEffect(() => {
        if (headingInView) headingControls.start("visible");
        else headingControls.start("hidden");
    }, [headingInView, headingControls]);

    const headingVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
    };

    return (
        <div className="min-h-auto bg-gradient-to-br from-[#e6f4f1] via-[#f2f9f8] to-[#ffffff] pt-16 sm:pt-10 pb-32 px-4 sm:px-6 md:px-10">
            <main className="flex-grow container max-w-3xl mx-auto px-2 sm:px-4 py-8 mt-10">
                <motion.div
                    ref={headingRef}
                    className="mb-12 text-center sm:mb-12"
                    initial="hidden"
                    animate={headingControls}
                    variants={headingVariants}
                >
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 select-none">
                        Terms and Conditions
                    </h1>
                    <p className="text-gray-700 font-light leading-relaxed">
                        Find answers to the most common questions about our services and policies.
                    </p>
                </motion.div>
                <div className="space-y-4">
                    {terms.map(({ title, content }, i) => {
                        const controls = useAnimation();
                        const ref = useRef<HTMLDivElement | null>(null);
                        const inView = useInView(ref);

                        useEffect(() => {
                            if (inView) controls.start("visible");
                            else controls.start("hidden");
                        }, [controls, inView]);

                        return (
                            <motion.div
                                key={i}
                                ref={ref}
                                className="border rounded shadow-sm"
                                initial="hidden"
                                animate={controls}
                                variants={variants}
                            >
                                <button
                                    onClick={() => toggleSection(i)}
                                    className="w-full flex justify-between items-center px-4 py-3 text-left text-base sm:text-lg font-semibold text-[#287f71] hover:bg-[#d9f0ec] transition"
                                    aria-expanded={openSection === i}
                                    aria-controls={`section-content-${i}`}
                                    id={`section-header-${i}`}
                                >
                                    {title}
                                    <span className="ml-2 text-xl select-none">{openSection === i ? "−" : "+"}</span>
                                </button>
                                {openSection === i && (
                                    <motion.div
                                        id={`section-content-${i}`}
                                        role="region"
                                        aria-labelledby={`section-header-${i}`}
                                        className="px-6 py-4 text-gray-700 leading-relaxed border-t"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        style={{ overflow: "hidden" }}
                                    >
                                        {content}
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
