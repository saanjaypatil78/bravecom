"use client";

import React, { useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED PRODUCT CARD — 3D tilt + glow + staggered entrance
   ═══════════════════════════════════════════════════════════════════════════ */

interface AnimatedProductCardProps {
    children: React.ReactNode;
    index: number;
    className?: string;
}

export function AnimatedProductCard({ children, index, className = "" }: AnimatedProductCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);

    const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 });
    const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        rotateY.set(x * 15);
        rotateX.set(-y * 15);
    }, [rotateX, rotateY]);

    const handleMouseLeave = useCallback(() => {
        rotateX.set(0);
        rotateY.set(0);
    }, [rotateX, rotateY]);

    // Randomized entrance per card
    const entrances = [
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 60, x: -40, opacity: 0 },
        { y: 60, x: 40, opacity: 0 },
        { y: 100, opacity: 0, rotateX: 20 },
        { opacity: 0, scale: 0.5 },
        { y: 80, opacity: 0, rotateY: -15 },
    ];
    const entrance = entrances[index % entrances.length];

    return (
        <motion.div
            ref={ref}
            className={`relative ${className}`}
            initial={entrance}
            animate={isInView ? { y: 0, x: 0, opacity: 1, scale: 1, rotateX: 0, rotateY: 0 } : entrance}
            transition={{
                duration: 0.7 + (index % 3) * 0.1,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
            }}
            style={{
                perspective: 1000,
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: "preserve-3d",
            }}
            whileHover={{
                scale: 1.04,
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px rgba(37,244,244,0.2)",
                transition: { duration: 0.3, ease: "easeOut" },
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED STAT CARD — Entrance with number counter
   ═══════════════════════════════════════════════════════════════════════════ */

interface AnimatedStatCardProps {
    children: React.ReactNode;
    index: number;
    className?: string;
}

export function AnimatedStatCard({ children, index, className = "" }: AnimatedStatCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 60, scale: 0.9, filter: "blur(8px)" }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
            transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
                y: -8,
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.4), 0 0 20px rgba(244,37,175,0.15)",
                transition: { duration: 0.3 },
            }}
        >
            {children}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED HERO BANNER — Gradient shift + parallax
   ═══════════════════════════════════════════════════════════════════════════ */

interface AnimatedBannerProps {
    children: React.ReactNode;
    className?: string;
}

export function AnimatedBanner({ children, className = "" }: AnimatedBannerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <motion.div
            ref={ref}
            className={`relative overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
                scale: 1.02,
                transition: { duration: 0.5 },
            }}
        >
            {/* Animated gradient overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-0"
                animate={{
                    background: [
                        "linear-gradient(135deg, rgba(244,37,175,0.1) 0%, transparent 50%)",
                        "linear-gradient(225deg, rgba(37,244,244,0.1) 0%, transparent 50%)",
                        "linear-gradient(315deg, rgba(244,37,175,0.1) 0%, transparent 50%)",
                        "linear-gradient(45deg, rgba(37,244,244,0.1) 0%, transparent 50%)",
                        "linear-gradient(135deg, rgba(244,37,175,0.1) 0%, transparent 50%)",
                    ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            {children}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED TITLE — Dramatic text reveal
   ═══════════════════════════════════════════════════════════════════════════ */

interface AnimatedTitleProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function AnimatedTitle({ children, className = "", delay = 0 }: AnimatedTitleProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{
                duration: 1,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            {children}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED CATEGORY CARD — 3D flip reveal + hover effects
   ═══════════════════════════════════════════════════════════════════════════ */

interface AnimatedCategoryCardProps {
    children: React.ReactNode;
    index: number;
    className?: string;
}

export function AnimatedCategoryCard({ children, index, className = "" }: AnimatedCategoryCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springRX = useSpring(rotateX, { stiffness: 200, damping: 20 });
    const springRY = useSpring(rotateY, { stiffness: 200, damping: 20 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        rotateY.set(x * 12);
        rotateX.set(-y * 12);
    }, [rotateX, rotateY]);

    const handleMouseLeave = useCallback(() => {
        rotateX.set(0);
        rotateY.set(0);
    }, [rotateX, rotateY]);

    // Varied entrance per card
    const entrances = [
        { y: 100, opacity: 0, rotateX: 30 },
        { x: -80, opacity: 0, rotateY: 20 },
        { y: 80, opacity: 0, scale: 0.7 },
        { x: 80, opacity: 0, rotateY: -20 },
        { y: 60, opacity: 0, rotateX: -20 },
        { opacity: 0, scale: 0.4, rotate: 10 },
    ];
    const entrance = entrances[index % entrances.length];

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={entrance}
            animate={isInView ? { y: 0, x: 0, opacity: 1, scale: 1, rotateX: 0, rotateY: 0, rotate: 0 } : entrance}
            transition={{
                duration: 0.8 + (index % 3) * 0.1,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
            }}
            style={{
                perspective: 1000,
                rotateX: springRX,
                rotateY: springRY,
                transformStyle: "preserve-3d",
            }}
            whileHover={{
                scale: 1.03,
                boxShadow: "0 25px 50px -12px rgba(37,244,244,0.2), 0 0 30px rgba(37,244,244,0.15)",
                transition: { duration: 0.3 },
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    );
}
