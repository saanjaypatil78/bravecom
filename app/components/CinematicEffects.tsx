"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATION VARIANTS POOL — 20 entrance types
   Each visitor gets a different combination = 1000+ variations
   ═══════════════════════════════════════════════════════════════════════════ */

const entranceVariants = [
    // 1. Fade Up
    { hidden: { opacity: 0, y: 80 }, visible: { opacity: 1, y: 0 } },
    // 2. Fade Down
    { hidden: { opacity: 0, y: -80 }, visible: { opacity: 1, y: 0 } },
    // 3. Fade Left
    { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } },
    // 4. Fade Right
    { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0 } },
    // 5. Zoom In
    { hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1 } },
    // 6. Zoom Out
    { hidden: { opacity: 0, scale: 1.5 }, visible: { opacity: 1, scale: 1 } },
    // 7. Rotate In
    { hidden: { opacity: 0, rotate: -15, scale: 0.8 }, visible: { opacity: 1, rotate: 0, scale: 1 } },
    // 8. Flip X
    { hidden: { opacity: 0, rotateX: 90 }, visible: { opacity: 1, rotateX: 0 } },
    // 9. Flip Y
    { hidden: { opacity: 0, rotateY: 90 }, visible: { opacity: 1, rotateY: 0 } },
    // 10. Slide Zoom
    { hidden: { opacity: 0, y: 100, scale: 0.7 }, visible: { opacity: 1, y: 0, scale: 1 } },
    // 11. Spiral
    { hidden: { opacity: 0, rotate: 180, scale: 0 }, visible: { opacity: 1, rotate: 0, scale: 1 } },
    // 12. Blur In
    { hidden: { opacity: 0, filter: "blur(20px)" }, visible: { opacity: 1, filter: "blur(0px)" } },
    // 13. Scale Bounce
    { hidden: { opacity: 0, scale: 0.3 }, visible: { opacity: 1, scale: 1 } },
    // 14. Wave
    { hidden: { opacity: 0, y: 60, rotate: 5 }, visible: { opacity: 1, y: 0, rotate: 0 } },
    // 15. Parallax Rise
    { hidden: { opacity: 0, y: 120, rotateX: 15 }, visible: { opacity: 1, y: 0, rotateX: 0 } },
    // 16. Depth Reveal
    { hidden: { opacity: 0, z: -300, rotateY: -10 }, visible: { opacity: 1, z: 0, rotateY: 0 } },
    // 17. Curtain Left
    { hidden: { opacity: 0, x: -200, skewX: 10 }, visible: { opacity: 1, x: 0, skewX: 0 } },
    // 18. Curtain Right
    { hidden: { opacity: 0, x: 200, skewX: -10 }, visible: { opacity: 1, x: 0, skewX: 0 } },
    // 19. Pop
    { hidden: { opacity: 0, scale: 0, rotate: 30 }, visible: { opacity: 1, scale: 1, rotate: 0 } },
    // 20. Morph
    { hidden: { opacity: 0, scale: 0.5, borderRadius: "50%" }, visible: { opacity: 1, scale: 1, borderRadius: "0%" } },
];

const timingCurves = [
    [0.16, 1, 0.3, 1],     // cinematic
    [0.68, -0.55, 0.265, 1.55], // bounce
    [0.175, 0.885, 0.32, 1.275], // elastic
    [0.34, 1.56, 0.64, 1],      // spring
    [0.25, 0.46, 0.45, 0.94],   // smooth
] as const;

const durations = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2];

/**
 * Get deterministic random based on seed — same page visit = same variant
 * Different elements get different variants
 */
function seededRandom(seed: number): number {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
}

function getVariantForElement(elementIndex: number, pageVisitSeed: number) {
    const seed = elementIndex * 17 + pageVisitSeed;
    const entranceIdx = Math.floor(seededRandom(seed) * entranceVariants.length);
    const curveIdx = Math.floor(seededRandom(seed + 100) * timingCurves.length);
    const durationIdx = Math.floor(seededRandom(seed + 200) * durations.length);

    return {
        entrance: entranceVariants[entranceIdx],
        curve: timingCurves[curveIdx],
        duration: durations[durationIdx],
    };
}

// Page visit seed — deterministic per page load, safe for SSR
const pageVisitSeed = 42;

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL REVEAL — Visible scroll-triggered animation
   ═══════════════════════════════════════════════════════════════════════════ */

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    index?: number;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "zoom" | "random";
}

export function ScrollReveal({
    children,
    className = "",
    index = 0,
    delay = 0,
    direction = "random",
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const variant = direction === "random"
        ? getVariantForElement(index, pageVisitSeed)
        : {
            entrance: {
                up: entranceVariants[0],
                down: entranceVariants[1],
                left: entranceVariants[2],
                right: entranceVariants[3],
                zoom: entranceVariants[4],
            }[direction]!,
            curve: timingCurves[0],
            duration: 0.8,
        };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={variant.entrance.hidden}
            animate={isInView ? variant.entrance.visible : variant.entrance.hidden}
            transition={{
                duration: variant.duration,
                delay: delay,
                ease: [...variant.curve] as [number, number, number, number],
            }}
            style={{ perspective: 1000 }}
        >
            {children}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAGGER GRID — Animated grid with staggered children
   ═══════════════════════════════════════════════════════════════════════════ */

interface StaggerGridProps {
    children: React.ReactNode[];
    className?: string;
    staggerDelay?: number;
}

export function StaggerGrid({ children, className = "", staggerDelay = 0.1 }: StaggerGridProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: staggerDelay } },
            }}
        >
            {children.map((child, i) => {
                const v = getVariantForElement(i, pageVisitSeed);
                return (
                    <motion.div
                        key={i}
                        variants={{
                            hidden: v.entrance.hidden,
                            visible: v.entrance.visible,
                        }}
                        transition={{
                            duration: v.duration,
                            ease: [...v.curve] as [number, number, number, number],
                        }}
                        style={{ perspective: 800 }}
                    >
                        {child}
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TILT CARD — 3D mouse-tracking card with visible tilt
   ═══════════════════════════════════════════════════════════════════════════ */

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
    glowColor?: string;
}

export function TiltCard({
    children,
    className = "",
    intensity = 15,
    glowColor = "rgba(37, 244, 244, 0.3)",
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            rotateY.set(x * intensity);
            rotateX.set(-y * intensity);
        },
        [intensity, rotateX, rotateY]
    );

    const handleMouseLeave = useCallback(() => {
        rotateX.set(0);
        rotateY.set(0);
        setIsHovered(false);
    }, [rotateX, rotateY]);

    const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 });
    const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 });

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                perspective: 1000,
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: "preserve-3d",
            }}
            whileHover={{
                scale: 1.05,
                boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px ${glowColor}`,
                transition: { duration: 0.3 },
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {/* Highlight overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 60%)`,
                    opacity: isHovered ? 0.3 : 0,
                    transition: "opacity 0.3s",
                }}
            />
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARALLAX LAYER — Different scroll speeds for 3D depth
   ═══════════════════════════════════════════════════════════════════════════ */

interface ParallaxLayerProps {
    children: React.ReactNode;
    speed?: number; // -1 to 1, negative = opposite direction
    className?: string;
}

export function ParallaxLayer({ children, speed = 0.5, className = "" }: ParallaxLayerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);
    const springY = useSpring(y, { stiffness: 100, damping: 30 });

    return (
        <motion.div ref={ref} className={className} style={{ y: springY }}>
            {children}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING PARTICLES — Ambient background particles
   ═══════════════════════════════════════════════════════════════════════════ */

export function FloatingParticles({ count = 20, color = "#25f4f4" }: { count?: number; color?: string }) {
    const [particles, setParticles] = useState<{ id: number; size: number; x: number; y: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        setParticles(
            Array.from({ length: count }, (_, i) => ({
                id: i,
                size: Math.random() * 4 + 1,
                x: Math.random() * 100,
                y: Math.random() * 100,
                duration: Math.random() * 10 + 8,
                delay: Math.random() * 5,
            }))
        );
    }, [count]);

    if (particles.length === 0) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        backgroundColor: color,
                        opacity: 0.3,
                    }}
                    animate={{
                        y: [0, -30, 10, -20, 0],
                        x: [0, 15, -10, 5, 0],
                        opacity: [0.1, 0.4, 0.2, 0.5, 0.1],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CINEMATIC TEXT — Animated title with character-by-character reveal
   ═══════════════════════════════════════════════════════════════════════════ */

interface CinematicTextProps {
    text: string;
    className?: string;
    charDelay?: number;
}

export function CinematicText({ text, className = "", charDelay = 0.03 }: CinematicTextProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <span ref={ref} className={className}>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, rotateX: 90 }}
                    animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 20, rotateX: 90 }}
                    transition={{
                        delay: i * charDelay,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ display: "inline-block", perspective: 500 }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL PROGRESS — Global scroll progress indicator
   ═══════════════════════════════════════════════════════════════════════════ */

export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 z-[9999] origin-left"
            style={{
                scaleX,
                background: "linear-gradient(90deg, #1173d4, #25f4f4, #c026d3)",
            }}
        />
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE TRANSITION — Wrapper for page entrance
   ═══════════════════════════════════════════════════════════════════════════ */

export function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    );
}
