/**
 * Privacy Policy Component
 * 
 * @update 8/11/2025
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, easeOut, useAnimation, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react"; // or any icon library you prefer

const sections = [
    {
        key: "information",
        title: "Information We Collect",
        content: (
            <ul className="list-disc list-inside ml-6 space-y-2">
                <li>Business and account information such as company name, email, and contact details.</li>
                <li>Payment and billing information processed securely by trusted providers.</li>
                <li>Usage data like IP address, browser type, and device info collected via cookies.</li>
            </ul>
        ),
    },
    {
        key: "use",
        title: "Use of Information",
        content: (
            <ul className="list-disc list-inside ml-6 space-y-2">
                <li>Managing accounts, subscriptions, and payments.</li>
                <li>Providing customer support and important updates.</li>
                <li>Improving platform features and user experience.</li>
                <li>Preventing fraud and unauthorized access.</li>
            </ul>
        ),
    },
    {
        key: "sharing",
        title: "Information Sharing",
        content: (
            <ul className="list-disc list-inside ml-6 space-y-2">
                <li><strong>Trusted Providers:</strong> Payment processors, hosting, and analytics services.</li>
                <li><strong>Legal Compliance:</strong> When required by law or legal requests.</li>
            </ul>
        ),
    },
    {
        key: "security",
        title: "Data Security",
        content: (
            <p>
                We use industry-standard measures to protect your information, but no method of online transmission is 100% secure.
            </p>
        ),
    },
    {
        key: "cookies",
        title: "Cookies and Tracking",
        content: (
            <p>
                We use cookies to improve usability and analyze interactions. You may disable cookies in browser settings, but some features may be limited.
            </p>
        ),
    },
    {
        key: "updates",
        title: "Policy Updates",
        content: (
            <p>
                We may update this Privacy Policy at any time. Changes will be reflected here with a new revision date.
            </p>
        ),
    },
    {
        key: "contact",
        title: "Contact Us",
        content: (
            <p>
                If you have any questions or concerns, please reach out via our website contact page.
            </p>
        ),
    },
];

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

export default function PrivacyPolicy() {
    const [openKey, setOpenKey] = useState<string | null>(null);

    const toggleSection = (key: string) => {
        setOpenKey((prev) => (prev === key ? null : key));
    };


    const controls = useAnimation()
    const ref = useRef(null)
    const inView = useInView(ref, { amount: 0.3 }) // trigger when 30% in view

    useEffect(() => {
        if (inView) {
            controls.start("visible")
        } else {
            controls.start("hidden")
        }
    }, [inView, controls])

    return (
        <main className="min-h-screen bg-gradient-to-r from-[#e6f4f1] via-[#f2f9f8] to-[#ffffff] py-20 px-6 sm:pb-28 sm:px-12 lg:px-24">
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
                    Privacy Policy
                </h2>
                <p className="text-gray-700 max-w-2xl mx-auto font-light leading-relaxed">
                    At <b>Coord.Travel</b>, we are committed to protecting the privacy and security of our customers' personal information.
                    This Privacy Policy outlines how we collect, use, and safeguard your information when you use our services.
                    By using our services, you consent to the practices described in this policy.</p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-5">
                {sections.map(({ key, title, content }) => {
                    const isOpen = openKey === key;
                    return (
                        <motion.div
                            key={key}
                            className="bg-white bg-opacity-70 backdrop-blur-md rounded-3xl shadow-lg mb-8"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            tabIndex={0}
                            aria-expanded={isOpen}
                            aria-controls={`${key}-content`}
                        >
                            <button
                                className="w-full flex justify-between items-center p-6 text-left focus:outline-none focus:ring-2 focus:ring-[#287f71] rounded-3xl"
                                onClick={() => toggleSection(key)}
                                aria-controls={`${key}-content`}
                                aria-expanded={isOpen}
                            >
                                <h2 className="text-2xl font-semibold text-[#287f71]">{title}</h2>
                                <motion.span
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    aria-hidden="true"
                                >
                                    <ChevronDown className="w-6 h-6 text-[#287f71]" />
                                </motion.span>
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        id={`${key}-content`}
                                        className="px-6 pb-6 text-gray-800 text-lg leading-relaxed py-4"
                                        initial="collapsed"
                                        animate="open"
                                        exit="collapsed"
                                        variants={{
                                            open: { height: "auto", opacity: 1, marginTop: 0 },
                                            collapsed: { height: 0, opacity: 0, marginTop: -10 },
                                        }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        style={{ overflow: "hidden" }}
                                    >
                                        {content}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </main>
    );
}
