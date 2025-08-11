"use client";

import Image from "next/image";
import React from "react";
import { motion, type Variants, useAnimation, useInView, useReducedMotion } from "framer-motion";

type Bullet = {
    icon?: React.ReactNode; // pass an SVG/emoji/icon component
    title: string;
    description: string;
};

type Props = {
    eyebrow?: string;
    title: string;
    intro?: string;
    bullets: Bullet[];
    imageSrc: string;
    imageAlt?: string;
    reverse?: boolean; // flip image/content
    className?: string;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const popIn: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 12 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const staggerCol: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

/** Replay-on-scroll wrapper: toggles hidden/visible on enter/leave */
function ReplayOnScroll({
    children,
    className,
    variants,
    amount = 0.25,
}: {
    children: React.ReactNode;
    className?: string;
    variants: Variants;
    amount?: number;
}) {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const inView = useInView(ref, { amount, margin: "0px 0px -10% 0px" });
    const controls = useAnimation();
    const prefersReduced = useReducedMotion();

    React.useEffect(() => {
        if (prefersReduced) {
            controls.set("visible");
            return;
        }
        if (inView) controls.start("visible");
        else controls.start("hidden");
    }, [inView, controls, prefersReduced]);

    return (
        <motion.div ref={ref} className={className} variants={variants} initial="hidden" animate={controls}>
            {children}
        </motion.div>
    );
}

export default function FeatureSplit({
    eyebrow = "",
    title,
    intro,
    bullets,
    imageSrc,
    imageAlt = "",
    reverse = false,
    className = "",
}: Props) {
    return (
        <section className="flex flex-col min-h-auto bg-gradient-to-r from-[#e6f4f1] via-[#f2f9f8] to-[#ffffff] pb-8">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:py-16 md:py-20 md:grid-cols-2 md:gap-14">
                {/* Left: Image */}
                <div className={reverse ? "md:order-2" : ""}>
                    <ReplayOnScroll variants={popIn} amount={0.3}>
                        <div className="relative mx-auto aspect-[16/10] w-full max-w-2xl overflow-hidden">
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                fill
                                priority
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 640px"
                            />
                        </div>
                    </ReplayOnScroll>
                </div>

                {/* Right: Copy */}
                <div className={reverse ? "md:order-1" : ""}>
                    <ReplayOnScroll variants={staggerCol} amount={0.3}>
                        {eyebrow && (
                            <motion.div className="text-sm font-semibold tracking-widest" variants={fadeUp}>
                                {eyebrow.toUpperCase()}
                            </motion.div>
                        )}

                        <motion.h2
                            className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight"
                            variants={fadeUp}
                        >
                            {title}
                        </motion.h2>

                        {intro && (
                            <motion.p className="mt-5 max-w-2xl" variants={fadeUp}>
                                {intro.toLowerCase()
                                    .split(" ")
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")}
                            </motion.p>
                        )}

                        <motion.ul className="mt-8 md:mt-10 space-y-6 md:space-y-8" variants={staggerCol}>
                            {bullets.map((b, i) => (
                                <motion.li key={i} className="flex items-start gap-4 md:gap-5" variants={fadeUp}>
                                    <span className="flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5">
                                        <span className="text-xl md:text-3xl text-[#287f71]">{b.icon ?? "🔹"}</span>
                                    </span>
                                    <div>
                                        <h3 className="text-base md:text-lg font-semibold tracking-wide">
                                            {b.title.toUpperCase()}
                                        </h3>
                                        <p className="mt-2 max-w-lg">{b.description}</p>
                                    </div>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </ReplayOnScroll>
                </div>
            </div>
        </section>
    );
}
