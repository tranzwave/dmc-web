/**
 * Dashboard Preview Section
 * 
 * @create 8/10/2025
 * 
 */

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";

export default function DashboardPreview() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const imageRef = useRef(null);

  const leftControls = useAnimation();
  const rightControls = useAnimation();
  const imageControls = useAnimation();

  const leftInView = useInView(leftRef, { margin: "-100px" });
  const rightInView = useInView(rightRef, { margin: "-100px" });
  const imageInView = useInView(imageRef, { margin: "-100px" });

  useEffect(() => {
    if (leftInView) {
      leftControls.start({ opacity: 1, x: 0 });
    } else {
      leftControls.start({ opacity: 0, x: -30 });
    }
  }, [leftInView, leftControls]);

  useEffect(() => {
    if (rightInView) {
      rightControls.start({ opacity: 1, scale: 1 });
    } else {
      rightControls.start({ opacity: 0, scale: 0.8 });
    }
  }, [rightInView, rightControls]);

  useEffect(() => {
    if (imageInView) {
      imageControls.start({ opacity: 1, y: 0 });
    } else {
      imageControls.start({ opacity: 0, y: 20 });
    }
  }, [imageInView, imageControls]);

  return (
    <div className="bg-gray-50">
      <section className="mx-auto bg-gray-50 flex sm:pb-24 flex-col md:flex-row items-center justify-center w-full px-6 sm:px-6 lg:px-10 py-12 sm:py-16 gap-10 sm:gap-12">
        {/* Left Text */}
        <motion.div
          ref={leftRef}
          className="max-w-full md:max-w-4xl flex flex-col gap-5 sm:gap-6"
          initial={{ opacity: 0, x: -30 }}
          animate={leftControls}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
            Launch Your Travel Business Faster with Coord Travel
          </h2>
          <p className="text-gray-700 text-base sm:text-lg">
            Already have travel products? Seamlessly import and manage your offerings with Coord Travel’s
            easy-to-use platform. Start selling your tours and experiences worldwide within minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 mt-6 sm:mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={leftControls}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="max-w-full sm:max-w-xs"
            >
              <h3 className="text-lg sm:text-xl font-bold">
                Get Booked in Days
              </h3>
              <p className="text-gray-700 mt-1 text-sm sm:text-base">
                Most Coord Travel partners receive their first bookings within days of joining.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={leftControls}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="max-w-full sm:max-w-xs"
            >
              <h3 className="text-lg sm:text-xl font-bold">
                Zero Commission Fees
              </h3>
              <p className="text-gray-700 mt-1 text-sm sm:text-base">
                Coord Travel offers a commission-free platform to maximize your earnings.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Circular Logos with bigger dotted circles */}
        <motion.div
          ref={rightRef}
          className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={rightControls}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Outer dotted circle */}
          <div
            className="absolute inset-0 rounded-full border border-dashed border-green-600 opacity-40 animate-spin-slow"
            style={{ borderWidth: "2px" }}
          />
          {/* Inner dotted circle */}
          <div
            className="absolute inset-16 rounded-full border border-dashed border-blue-500 opacity-60 animate-spin-slow"
            style={{ borderWidth: "2px" }}
          />

          {/* Coord Travel logo top */}
          <motion.div
            className="absolute top-0 left-0 transform -translate-x-1/2 bg-white bg-opacity-95 rounded-full p-3 sm:p-4 shadow-md ring-1 ring-gray-200 cursor-pointer transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 1.2,
              duration: 0.5,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{ scale: 1.1 }}
          >
            <Image
              src="/assets/new-logo.png"
              alt="Coord Travel"
              width={70}
              height={35}
              style={{ objectFit: "contain" }}
            />
          </motion.div>

          {/* Powered by / partner logo center (optional) */}
          <motion.div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-95 rounded-full shadow-md ring-1 ring-gray-200 cursor-pointer transition duration-300 ease-in-out hover:shadow-xl flex items-center justify-center"
            style={{ width: 68, height: 68 }} // Slightly bigger than image size (60x60)
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 1.5,
              duration: 0.6,
              type: "spring",
              stiffness: 120,
            }}
            whileHover={{ scale: 1.15 }}
          >
            <Image
              src="/assets/icon-wrapper.png"
              alt="Powered by"
              width={60}
              height={60}
              style={{ objectFit: "contain" }}
            />
          </motion.div>

          {/* Your Company logo bottom */}
          <motion.div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 rounded-full px-6 py-3 shadow-md text-gray-800 font-semibold text-base sm:text-lg cursor-pointer select-none transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-white"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 1.8,
              duration: 0.5,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{ scale: 1.05 }}
          >
            Coord.Travel
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Preview */}
      <motion.section
        ref={imageRef}
        className="py-16 px-4 sm:py-20 bg-gradient-to-b from-[#287f71]/10 to-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={imageControls}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="/assets/landing/booking.png"
              alt="Dashboard preview"
              width={1280}
              height={720}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </motion.section>
    </div>
  );
}
