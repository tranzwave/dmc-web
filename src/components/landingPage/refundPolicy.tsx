"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function RefundPolicy() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 backdrop-blur-sm p-12 sm:p-14 sm:pb-24">
      <main className="flex-grow container mx-auto px-6 sm:px-16 lg:px-28 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            Refund Policy
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto font-light leading-relaxed">
            At <b>Coord.Travel</b>, we value customer satisfaction and strive to provide the best service experience. This Refund Policy outlines the conditions under which refunds are processed for our subscription-based services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map(({ key, title, content }) => {
            const isOpen = openKey === key;

            return (
              <div
                key={key}
                className="bg-white bg-opacity-40 backdrop-blur-md rounded-2xl shadow-lg border border-transparent hover:border-[#287f71] transition-colors duration-300"
              >
                <button
                  onClick={() => toggleSection(key)}
                  aria-expanded={isOpen}
                  aria-controls={`${key}-content`}
                  className="w-full flex justify-between items-center px-8 py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#287f71] rounded-2xl"
                >
                  <h3 className="text-2xl font-semibold text-[#287f71] drop-shadow-sm">{title}</h3>
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#287f71] transform transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${key}-content`}
                      className="px-8 pb-6 text-gray-900 prose prose-green max-w-none"
                      initial={{ height: 0, opacity: 0, marginTop: -10 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 0 }}
                      exit={{ height: 0, opacity: 0, marginTop: -10 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      {content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
