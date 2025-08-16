"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Map, MapPin, Share2, MessageSquare, Sliders, RefreshCw } from "lucide-react";

const features = [
  {
    icon: <Map className="w-10 h-10 text-[#287f71]" />,
    title: "Build Quickly",
    description:
      "Build itineraries quickly with an easy-to-use interface, auto-saving and reusable itineraries – increasing the efficiency of your agency.",
  },
  {
    icon: <MapPin className="w-10 h-10 text-[#287f71]" />,
    title: "Visualize with Maps",
    description:
      "Use maps to locate nearby locations, identify distances and better plot the itinerary.",
  },
  {
    icon: <Share2 className="w-10 h-10 text-[#287f71]" />,
    title: "Share with Contacts",
    description:
      "Itineraries can be shared with customers online quickly and beautifully. Agents will receive in-app as well as email notifications about customer actions.",
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-[#287f71]" />,
    title: "Receive Feedback",
    description:
      "Customers can comment or share feedback on the Quotations shared with them. Improve the itinerary plan using their feedback on different versions.",
  },
  {
    icon: <Sliders className="w-10 h-10 text-[#287f71]" />,
    title: "Easily Configurable",
    description:
      "Configure the itinerary builder with parameters unique to your organization. Use your own percentages and payment terms.",
  },
  {
    icon: <RefreshCw className="w-10 h-10 text-[#287f71]" />,
    title: "Reuse Library Data",
    description:
      "All data, including Quotations, can be reused to create a new travel plan. Add accommodations, activities, transport, and itinerary days from the library while building.",
  },
];

// Variants to stagger children on enter and exit, reverse order on exit
const containerVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      staggerChildren: 0.15,
      staggerDirection: -1, // reverse on exit
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      staggerDirection: 1, // normal on enter
    },
  },
};

// Item fade+slide variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ItineraryFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });

  return (
    <div
      className="py-20 bg-gradient-to-r from-[#e6f4f1] via-[#f2f9f8] to-[#ffffff]"
    >
      <motion.section className="max-w-6xl mx-auto px-6 text-center"
      ref={ref}

            variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}>
        {/* Heading + Subheading wrapped in motion div for stagger */}
        <motion.div variants={containerVariants} className="inline-block">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-semibold text-gray-900"
          >
            Itinerary Builder Beyond Your Expectation
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-3 text-sm tracking-wider text-gray-500 max-w-3xl mx-auto"
          >
            Building itineraries requires consideration of many variables. Toursoft
            makes it simpler by allowing travel agents build one block at a time.
          </motion.p>
        </motion.div>

        {/* Blue underline */}
        <div className="flex justify-center mt-4">
          <div className="w-20 h-[3px] bg-[#287f71] rounded-full"></div>
        </div>

        {/* Features Grid */}
        <motion.div
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-left"
          variants={containerVariants}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col"
            >
              {feature.icon}
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}
