// components/SupportSection.tsx
import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export default function SupportSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" }); // trigger a bit before fully in view
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 20 });
    }
  }, [isInView, controls]);

  return (
    <section className="w-full bg-white py-12 pb-16" ref={ref}>
      <motion.div
        className="max-w-5xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          Grow with confidence. Support when you need it.
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
          The <span className="font-semibold text-primary-600">COORD.TRAVEL Team</span> is here to support you every step of the way on your travel business journey. Connect with our dedicated customer support team via live chat, or explore our Help Center full of helpful resources, step-by-step guides, and troubleshooting tips.
        </p>
      </motion.div>
    </section>
  );
}
