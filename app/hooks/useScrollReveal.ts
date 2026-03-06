"use client";

import { useEffect, useRef, useCallback } from "react";

interface ScrollRevealOptions {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
}

const ANIMATION_POOL = [
    "cin-fade-up",
    "cin-fade-down",
    "cin-fade-left",
    "cin-fade-right",
    "cin-zoom-in",
    "cin-zoom-out",
    "cin-rotate-in",
    "cin-flip-x",
    "cin-flip-y",
    "cin-slide-zoom",
    "cin-blur-in",
    "cin-scale-bounce",
    "cin-wave",
    "cin-ripple",
    "cin-parallax-rise",
    "cin-depth-reveal",
    "cin-curtain",
    "cin-morph",
];

const TIMING_POOL = [
    "cin-timing-cinematic",
    "cin-timing-bounce",
    "cin-timing-elastic",
    "cin-timing-spring",
];

/**
 * useScrollReveal — IntersectionObserver hook that applies
 * randomized cinematic animation classes to elements as they
 * enter the viewport. Creates unique variation per visit.
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
    const { threshold = 0.15, rootMargin = "0px 0px -50px 0px", once = true } = options;

    const observerRef = useRef<IntersectionObserver | null>(null);

    const initObserver = useCallback(() => {
        if (typeof window === "undefined") return;
        if (observerRef.current) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;

                        // Pick animation from pool (deterministic per element position for consistency)
                        const rect = el.getBoundingClientRect();
                        const seed = Math.floor(rect.top + rect.left) % ANIMATION_POOL.length;
                        const animClass = el.dataset.cinAnimation || ANIMATION_POOL[seed];
                        const timingClass = TIMING_POOL[seed % TIMING_POOL.length];

                        el.classList.add("cin-visible", animClass, timingClass);
                        el.classList.remove("cin-reveal");

                        if (once) {
                            observerRef.current?.unobserve(el);
                        }
                    } else if (!once) {
                        const el = entry.target as HTMLElement;
                        ANIMATION_POOL.forEach((c) => el.classList.remove(c));
                        TIMING_POOL.forEach((c) => el.classList.remove(c));
                        el.classList.remove("cin-visible");
                        el.classList.add("cin-reveal");
                    }
                });
            },
            { threshold, rootMargin }
        );
    }, [threshold, rootMargin, once]);

    useEffect(() => {
        initObserver();
        return () => {
            observerRef.current?.disconnect();
            observerRef.current = null;
        };
    }, [initObserver]);

    /**
     * Call observe(container) to start watching all .cin-reveal
     * elements inside a container.
     */
    const observe = useCallback(
        (container: HTMLElement | null) => {
            if (!container || !observerRef.current) {
                initObserver();
            }
            if (!container) return;

            const elements = container.querySelectorAll(".cin-reveal");
            elements.forEach((el) => observerRef.current?.observe(el));
        },
        [initObserver]
    );

    /**
     * Ref callback — use as ref={revealRef} on container
     */
    const revealRef = useCallback(
        (node: HTMLElement | null) => {
            if (node) {
                initObserver();
                // Slight delay to let DOM settle
                requestAnimationFrame(() => observe(node));
            }
        },
        [initObserver, observe]
    );

    return { revealRef, observe };
}

/**
 * Get a specific animation class by name or index
 */
export function getAnimation(index: number): string {
    return ANIMATION_POOL[index % ANIMATION_POOL.length];
}

/**
 * Get stagger delay class for grid items
 */
export function getStagger(index: number): string {
    return `cin-stagger-${Math.min(index + 1, 12)}`;
}
