/**
 * Travel Library Section
 *
 * This section showcases the travel library management features.
 * 
 * @update 8/12/2025
 */
"use client";

import Image from "next/image";
import { motion, useInView, easeOut, easeIn } from "framer-motion";
import { useRef } from "react";

export default function TravelLibrarySection() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const leftInView = useInView(leftRef, { amount: 0.3, once: false });
  const rightInView = useInView(rightRef, { amount: 0.3, once: false });

  const leftVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.4, ease: easeIn } },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut, delay: 0.1 } },
    exit: { opacity: 0, x: 40, transition: { duration: 0.4, ease: easeIn } },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6 items-center">

        <motion.div
          ref={leftRef}
          initial="hidden"
          animate={leftInView ? "visible" : "exit"}
          variants={leftVariants}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 relative">
            Manage your travel library
            <span className="block w-20 h-[3px] bg-[#287f71] mt-2"></span>
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed max-w-lg">
            As a tour operator, your destination know-how is everything for your
            business. Toursoft makes it easy to create and search library records
            for location-specific items only you know about. Save items in your
            library as:
          </p>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1 text-gray-700">
            <ul className="list-disc list-inside space-y-1">
              <li>Quotations</li>
              <li>Accommodations</li>
              <li>Activities</li>
            </ul>
            <ul className="list-disc list-inside space-y-1">
              <li>Transports</li>
              <li>Itinerary days</li>
              <li>Services</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          ref={rightRef}
          initial="hidden"
          animate={rightInView ? "visible" : "exit"}
          variants={rightVariants}
          className="flex justify-center"
        >
          <Image
            src="/assets/new-logo.png"
            alt="Manage travel library"
            className="w-full max-w-md h-auto"
            priority
            width={100}
            height={80}
          />
        </motion.div>
      </div>
    </section>
  );
}
