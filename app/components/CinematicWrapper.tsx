"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal, getStagger } from "../hooks/useScrollReveal";

/* ═══════════════════════════════════════════════════════════════════════════
   CINEMATIC WRAPPER — Page transition wrapper
   ═══════════════════════════════════════════════════════════════════════════ */

interface CinematicWrapperProps {
    children: React.ReactNode;
    variant?: "fade" | "slide" | "zoom" | "morph";
}

const pageVariants = {
    fade: {
        initial: { opacity: 0, y: 20, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -20, filter: "blur(4px)" },
    },
    slide: {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -60 },
    },
    zoom: {
        initial: { opacity: 0, scale: 0.92, filter: "blur(6px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, scale: 1.05 },
    },
    morph: {
        initial: { opacity: 0, scale: 0.9, borderRadius: "30px" },
        animate: { opacity: 1, scale: 1, borderRadius: "0px" },
        exit: { opacity: 0, scale: 0.95 },
    },
};

export function CinematicWrapper({ children, variant = "fade" }: CinematicWrapperProps) {
    const vars = pageVariants[variant];
    return (
        <motion.div
            initial={vars.initial}
            animate={vars.animate}
            exit={vars.exit}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARALLAX SECTION — scroll-speed multiplied layer
   ═══════════════════════════════════════════════════════════════════════════ */

interface ParallaxSectionProps {
    children: React.ReactNode;
    speed?: number; // 0.5 = slow, 1 = normal, 1.5 = fast
    className?: string;
}

export function ParallaxSection({ children, speed = 0.5, className = "" }: ParallaxSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const scrolled = window.innerHeight - rect.top;
            setOffset(scrolled * (speed - 1) * 0.3);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [speed]);

    return (
        <div
            ref={ref}
            className={`cin-preserve-3d ${className}`}
            style={{ transform: `translateY(${offset}px)`, willChange: "transform" }}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLASS CARD — Glassmorphism card with 3D mouse-tracking tilt
   ═══════════════════════════════════════════════════════════════════════════ */

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    glassLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    tiltIntensity?: number; // 5-20
    glowColor?: string;
    hoverEffect?: "lift" | "glow" | "tilt-3d" | "expand";
}

export function GlassCard({
    children,
    className = "",
    glassLevel = 3,
    tiltIntensity = 10,
    hoverEffect = "lift",
}: GlassCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * tiltIntensity;
        const rotateX = (0.5 - y) * tiltIntensity;

        cardRef.current.style.transform =
            `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        cardRef.current.style.setProperty("--mouse-x", `${x * 100}%`);
        cardRef.current.style.setProperty("--mouse-y", `${y * 100}%`);
    }, [tiltIntensity]);

    const handleMouseLeave = useCallback(() => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateZ(0)";
    }, []);

    return (
        <div
            ref={cardRef}
            className={`cin-tilt-card glass-${glassLevel} cin-hover-${hoverEffect} rounded-xl overflow-hidden relative ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="cin-tilt-highlight" />
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED GRID — Staggered grid animation for product grids
   ═══════════════════════════════════════════════════════════════════════════ */

interface AnimatedGridProps {
    children: React.ReactNode[];
    className?: string;
    animationType?: string;
}

export function AnimatedGrid({
    children,
    className = "",
    animationType = "cin-fade-up",
}: AnimatedGridProps) {
    const { revealRef } = useScrollReveal({ threshold: 0.05 });

    return (
        <div ref={revealRef} className={className}>
            {children.map((child, i) => (
                <div
                    key={i}
                    className={`cin-reveal ${getStagger(i)}`}
                    data-cin-animation={animationType}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CINEMATIC HERO — Full hero section with 3D depth + particles
   ═══════════════════════════════════════════════════════════════════════════ */

interface CinematicHeroProps {
    title: string;
    subtitle?: string;
    gradient?: string;
    className?: string;
    children?: React.ReactNode;
}

export function CinematicHero({
    title,
    subtitle,
    gradient = "from-white to-slate-400",
    className = "",
    children,
}: CinematicHeroProps) {
    const particles = useMemo(() =>
        Array.from({ length: 15 }, (_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5,
            duration: Math.random() * 4 + 4,
            opacity: Math.random() * 0.3 + 0.1,
        })), []
    );

    return (
        <div className={`relative overflow-hidden cin-perspective ${className}`}>
            {/* Animated Background */}
            <div className="absolute inset-0 cin-aurora-bg opacity-50" />

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute rounded-full bg-white cin-float"
                        style={{
                            width: p.size,
                            height: p.size,
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            opacity: p.opacity,
                            animationDelay: `${p.delay}s`,
                            animationDuration: `${p.duration}s`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 cin-preserve-3d">
                <h1
                    className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${gradient} cin-text-blur-in`}
                >
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-4 text-lg md:text-xl text-slate-400 font-light cin-fade-up" style={{ ["--cin-delay" as string]: "0.3s" }}>
                        {subtitle}
                    </p>
                )}
                {children}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR — Fixed top progress indicator
   ═══════════════════════════════════════════════════════════════════════════ */

export function ScrollProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY / docHeight;
            setProgress(Math.min(scrolled, 1));
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className="cin-scroll-progress"
            style={{ transform: `scaleX(${progress})` }}
        />
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REVEAL SECTION — Wrapper that triggers scroll animation on children
   ═══════════════════════════════════════════════════════════════════════════ */

interface RevealSectionProps {
    children: React.ReactNode;
    className?: string;
    animation?: string;
}

export function RevealSection({
    children,
    className = "",
    animation = "cin-fade-up",
}: RevealSectionProps) {
    const { revealRef } = useScrollReveal();

    return (
        <div ref={revealRef} className={className}>
            <div className="cin-reveal" data-cin-animation={animation}>
                {children}
            </div>
        </div>
    );
}
