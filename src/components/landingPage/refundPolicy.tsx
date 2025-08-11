"use client";

import { easeOut, motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: easeOut,
        },
    },
};

export default function RefundPolicy() {
    const sections = [
        {
            key: "subscription",
            title: "Subscription Cancellations",
            content: (
                <>
                    <p>
                        Our subscription plans are billed on a recurring basis. You may cancel your subscription at
                        any time, but refunds are only issued under the following conditions:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>If you cancel within 3 days of your initial subscription purchase, you may be eligible for a full refund.</li>
                        <li>Refunds are not available for renewal payments unless required by applicable law.</li>
                        <li>To request a refund, please contact our support team with your account details and reason for cancellation.</li>
                    </ul>
                </>
            ),
        },
        {
            key: "process",
            title: "Refund Process",
            content: (
                <p>
                    If your refund request is approved, the amount will be credited to your original payment
                    method within 14 business days. Please note that processing times may vary depending on your
                    payment provider.
                </p>
            ),
        },
        {
            key: "nonRefundable",
            title: "Non-Refundable Items",
            content: (
                <>
                    <p>The following services are non-refundable:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>One-time setup fees.</li>
                        <li>Custom development or integration services.</li>
                        <li>Partial usage of a subscription period.</li>
                    </ul>
                </>
            ),
        },
        {
            key: "issues",
            title: "Service Issues",
            content: (
                <p>
                    If you experience any technical issues or disruptions with our service, please reach out to
                    our support team. We will work with you to resolve the issue, and if necessary, a refund may
                    be issued based on our assessment.
                </p>
            ),
        },
        {
            key: "contact",
            title: "Contact Us",
            content: (
                <p>
                    If you have any questions or concerns regarding our Refund Policy, please contact our
                    customer support team. We are here to assist you and ensure you have a smooth experience
                    with our platform.
                </p>
            ),
        },
    ];

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
        <div className="flex flex-col min-h-screen bg-white bg-opacity-80 backdrop-blur-sm p-12 sm:p-14 sm:pb-24">
            <main className="flex-grow container mx-auto px-6 sm:px-16 lg:px-28 py-16">
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
                        Refund Policy
                    </h2>
                    <p className="text-gray-700 max-w-2xl mx-auto font-light leading-relaxed">
                        At <b>Coord.Travel</b>, we value customer satisfaction and strive to provide the best service experience. This Refund Policy outlines the conditions under which refunds are processed for our subscription-based services.
                    </p>
                </motion.div>

                <motion.div className="space-y-12">
                    {sections.map(({ key, title, content }) => (
                        <motion.section
                            key={key}
                            variants={sectionVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.35 }}
                            className="bg-white bg-opacity-40 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-default border-0"
                            tabIndex={0}
                            aria-labelledby={`${key}-heading`}
                        >
                            {title && (
                                <h2
                                    id={`${key}-heading`}
                                    className="text-2xl font-semibold mb-5 text-[#287f71] drop-shadow-sm"
                                >
                                    {title}
                                </h2>
                            )}
                            <div className="prose prose-green max-w-none text-gray-900">{content}</div>
                        </motion.section>
                    ))}
                </motion.div>
            </main>
        </div>
    );
}
