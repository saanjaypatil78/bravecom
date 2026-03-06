"use client";

import { ScrollProgress, PageTransition } from "./CinematicEffects";

/**
 * CinematicLayout — Client-side layout wrapper adding:
 * - Scroll progress bar (gradient line at top of viewport)
 * - Page entrance animation (fade + blur + translate)
 */
export default function CinematicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ScrollProgress />
            <PageTransition>
                {children}
            </PageTransition>
        </>
    );
}
