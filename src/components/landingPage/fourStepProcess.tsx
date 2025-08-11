"use client";

import { easeInOut, motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { LogIn, Users, Boxes, Map } from "lucide-react"; // example icons

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeInOut } },
};

const steps = [
  {
    number: "01",
    title: "Sign up",
    desc: "Sign up for free and get started in 5 minutes!",
    icon: <LogIn className="h-12 w-12 text-[#287f71]" />,
  },
  {
    number: "02",
    title: "Build your team",
    desc: "Add your team members to the system and assign them roles",
    icon: <Users className="h-12 w-12 text-[#287f71]" />,
  },
  {
    number: "03",
    title: "Create data library",
    desc: "Create your data library with accommodations, activities, transport, and more.",
    icon: <Boxes className="h-12 w-12 text-[#287f71]" />,
  },
  {
    number: "04",
    title: "Start building",
    desc: "You are set to start creating Contacts > Prospects > Quotations",
    icon: <Map className="h-12 w-12 text-[#287f71]" />,
  },
];

export default function FourStepProcess() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
    else controls.start("hidden");
  }, [inView, controls]);

  return (
    <section className="bg-gray-50 py-16" ref={ref}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <motion.h2
          className="text-center text-2xl sm:text-3xl font-semibold text-gray-900"
          variants={fadeUp}
          initial="hidden"
          animate={controls}
        >
          Easy four step process to get started
        </motion.h2>

        {/* Steps line */}
        <motion.div
          className="relative mt-10 flex justify-between"
          initial="hidden"
          animate={controls}
          variants={fadeUp}
        >
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center w-1/4">
              {/* Circle number */}
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-400 bg-[#f5f8fc] text-gray-700 font-semibold">
                {i + 1}
              </div>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-6 left-0 w-full border-t-2 border-gray-300 z-0"></div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Steps content */}
        <motion.div
          className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          initial="hidden"
          animate={controls}
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center px-4">
              <div className="flex items-center justify-center text-[#287f71] mb-4">{step.icon}</div>
              <h3 className="font-semibold text-[#287f71]">
                <span className="text-[#287f71]">{step.number} </span>
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
