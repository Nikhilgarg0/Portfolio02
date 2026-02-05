"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, LayoutGroup } from 'framer-motion';

export default function Header({ activeSection }: { activeSection: string }) {
    const { scrollY } = useScroll();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobileMenuOpen]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 pointer-events-none">
            {/* Desktop Navigation */}
            <div className="hidden md:block pointer-events-auto">
                <DesktopNav activeSection={activeSection} scrollY={scrollY} />
            </div>

            {/* Mobile Navigation - iOS Dynamic Island Style */}
            <div className="md:hidden pointer-events-auto">
                <MobileNav
                    activeSection={activeSection}
                    isOpen={isMobileMenuOpen}
                    setIsOpen={setIsMobileMenuOpen}
                />
            </div>
        </header>
    );
}

// Desktop Navigation Component
function DesktopNav({ activeSection, scrollY }: { activeSection: string; scrollY: any }) {
    const containerWidth = useTransform(scrollY, [0, 100], ['700px', '520px']);
    const containerBg = useTransform(scrollY, [0, 100], ['rgba(0,0,0,0)', 'rgba(9,9,11,0.6)']);
    const containerBorder = useTransform(scrollY, [0, 100], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.1)']);
    const containerBackdrop = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(12px)']);
    const shadowOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

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
            className="flex items-center justify-between px-2 py-1.5 rounded-full border overflow-hidden"
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

// Mobile Navigation - iOS Dynamic Island Style
function MobileNav({ activeSection, isOpen, setIsOpen }: { activeSection: string; isOpen: boolean; setIsOpen: (open: boolean) => void }) {
    const navItems = ['About', 'Experience', 'Projects', 'Contact'];

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    // Collapsed State - Dynamic Island Pill
                    <motion.div
                        key="collapsed"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                        onClick={() => setIsOpen(true)}
                        className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                                <Menu size={14} className="text-white" />
                            </div>
                            <span className="text-sm font-medium text-white">Menu</span>
                        </div>
                    </motion.div>
                ) : (
                    // Expanded State - Full Menu
                    <motion.div
                        key="expanded"
                        initial={{ scale: 0.8, opacity: 0, height: 50 }}
                        animate={{ scale: 1, opacity: 1, height: 'auto' }}
                        exit={{ scale: 0.8, opacity: 0, height: 50 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        className="bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden"
                        style={{ minWidth: '280px' }}
                    >
                        {/* Header with Close Button */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                            <Link href="/" onClick={() => setIsOpen(false)}>
                                <div className="w-8 h-8 bg-white/10 text-white flex items-center justify-center rounded-full font-mono text-xs border border-white/10">
                                    DG
                                </div>
                            </Link>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X size={16} className="text-white" />
                            </button>
                        </div>

                        {/* Navigation Items */}
                        <div className="px-3 py-3 space-y-1">
                            {navItems.map((item) => {
                                const isActive = activeSection === item.toLowerCase();
                                return (
                                    <Link
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${isActive
                                                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {item}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* CV Button */}
                        <div className="px-3 pb-3 pt-2 border-t border-white/5">
                            <Link
                                href="/resume"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all duration-200"
                            >
                                View CV
                                <ChevronDown size={14} className="opacity-50" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
