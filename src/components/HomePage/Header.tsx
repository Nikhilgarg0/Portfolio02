"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, LayoutGroup } from 'framer-motion';

export default function Header({ activeSection }: { activeSection: string }) {
    const { scrollY } = useScroll();

    // Continuous scroll interpolations
    const navWidth = useTransform(scrollY, [0, 100], ['700px', '520px']); // Increased minimum width
    const navY = useTransform(scrollY, [0, 100], [0, 10]);
    const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.6]);
    const borderOpacity = useTransform(scrollY, [0, 50], [0, 0.1]);
    const blurAmount = useTransform(scrollY, [0, 50], [0, 16]);

    // Logo & CV Button animations (slide in from edges)
    // At scroll 0: gap is larger. At scroll 100: gap reduces.
    // Instead of gap, we'll animate their opacity/scale or position to "appear" closer?
    // User requested: "leftmost and rightmost element are far... then as we scroll they both comes closer"
    // So distinct items start far apart, then merge into pill?
    // Actually, current design has a wide pill that shrinks.
    // Let's interpret "closer": Max width 600px -> 350px (or auto).

    // Let's refine the width transform to be responsive
    // On mobile, width is typically '95%' -> '90%'.
    // We can use a motion value for width but simpler to use max-width or similar.
    // To handle responsive units in Framer Motion efficiently is tricky with string interpolation.
    // But we can just use class state for simplistic transitions OR proper motion values.

    // The user specifically disliked the "sudden" jump of `isScrolled`.
    // So we MUST use scrollY mapping.

    // We will use a unique approach: animate opacity/transform of outer elements based on scroll
    // and animate the container width.

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 pointer-events-none">
            <motion.nav
                style={{
                    width: useTransform(scrollY, [0, 100], ['90%', 'auto']), // Fallback for mobile/desktop mix?
                    // Better approach: Use constraints. 
                    // Let's use standard layout animation for width but driven by scroll classes?
                    // No, "ease in manner". Interpolation is best.
                    // But '90%' to 'auto' isn't interpolatable easily. 
                    // Let's stick to pixel approximations for desktop and percentage for mobile?
                    // Actually, let's keep the pill "auto" size mostly but add padding/margin animation.
                }}
                className="pointer-events-auto flex items-center justify-between px-2 p-2 rounded-full border transition-shadow duration-500"

            // We'll manualy bind styles because Tailwind classes can't interpolte continuously
            >
                <NavContent activeSection={activeSection} scrollY={scrollY} />
            </motion.nav>
        </header>
    );
}

function NavContent({ activeSection, scrollY }: { activeSection: string; scrollY: any }) {
    // Desktop width interpolation
    // At top (0): Max width ~700px
    // Scrolled (100): Fit content ~520px (wider for 4 items)

    const containerWidth = useTransform(scrollY, [0, 100], ['700px', '520px']);
    const containerBg = useTransform(scrollY, [0, 100], ['rgba(0,0,0,0)', 'rgba(9,9,11,0.6)']);
    const containerBorder = useTransform(scrollY, [0, 100], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.1)']);
    const containerBackdrop = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(12px)']);
    const shadowOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

    // Nav items
    const navItems = ['About', 'Experience', 'Projects', 'Contact'];

    return (
        <motion.div
            style={{
                width: containerWidth,
                backgroundColor: containerBg,
                borderColor: containerBorder,
                backdropFilter: containerBackdrop,
                boxShadow: useTransform(shadowOpacity, v => `0 8px 32px rgba(0,0,0,${v})`)
            }}
            className="flex items-center justify-between px-2 py-1.5 rounded-full border md:w-auto w-[90%] mx-auto overflow-hidden"
        >
            <Link href="/" className="px-3 py-2 font-heading font-bold flex items-center gap-2 group shrink-0">
                <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center rounded-full font-mono text-xs border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    DG
                </div>
            </Link>

            <div className="flex items-center justify-center flex-1 mx-2">
                <LayoutGroup id="navbar-pill">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.toLowerCase();
                        return (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full ${isActive ? 'text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-white/10 rounded-full border border-white/5 shadow-sm"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{item}</span>
                            </Link>
                        );
                    })}
                </LayoutGroup>
            </div>

            <Link
                href="/resume"
                className="px-3 py-2 rounded-full text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group shrink-0"
            >
                CV
                <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform opacity-50" />
            </Link>
        </motion.div>
    );
}
