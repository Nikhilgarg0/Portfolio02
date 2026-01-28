"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import { EASE_OUT } from '@/lib/constants';

// --- Hero Section ---
export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 800], [0, 200]);
    const opacity = useTransform(scrollY, [0, 600], [1, 0]);
    const codeOpacity = useTransform(scrollY, [0, 400], [1, 0.6]);

    return (
        <section ref={containerRef} className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20 md:pt-32 pb-16 md:pb-24 px-4 md:px-12">
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[200px] w-[200px] md:h-[310px] md:w-[310px] rounded-full bg-accent/20 opacity-20 blur-[100px]" />
            </div>

            <motion.div
                style={{ y: y1, opacity }}
                className="z-10 w-full max-w-5xl"
            >
                <div className="flex justify-center mb-8 md:mb-12">
                    <AvailabilityBadge />
                </div>

                <h1 className="font-heading text-3xl md:text-6xl lg:text-7xl tracking-tight mb-6 md:mb-8 leading-[1.2] text-center">
                    Building what's <br />
                    <span className="text-accent">next</span>
                </h1>

                <p className="text-center text-base md:text-xl text-foreground/70 mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed px-2">
                    Early-stage developer focused on web and mobile applications. Graduating 2026. Learning in public, building with intent.
                </p>

                <motion.div
                    style={{ opacity: codeOpacity }}
                    className="mb-12 md:mb-16 bg-foreground/5 border border-foreground/10 rounded-lg p-4 md:p-8 font-mono text-xs md:text-sm overflow-x-auto group hover:border-accent/30 hover:bg-foreground/[0.08] transition-all duration-500"
                >
                    <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <CodeSnippet />
                    <p className="text-xs text-foreground/40 mt-4 text-center">Click to expand</p>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-10 md:mb-12">
                    <ProjectsCTA />
                    <a href="#contact" className="px-6 py-3 border border-foreground/20 rounded-lg text-foreground/70 hover:border-accent hover:text-accent transition-all duration-300 font-medium text-sm md:text-base">
                        Get in Touch
                    </a>
                </div>

                <div className="flex justify-center gap-4 md:gap-6">
                    <SocialLink href="https://github.com" icon={<Github size={20} />} label="GitHub" />
                    <SocialLink href="https://linkedin.com" icon={<Linkedin size={20} />} label="LinkedIn" />
                    <SocialLink href="#contact" icon={<Mail size={20} />} label="Email" />
                </div>
            </motion.div>

            <motion.div
                style={{ opacity }}
                className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-foreground/40"
            >
                <ChevronDown size={24} />
            </motion.div>
        </section>
    );
}

// Code Snippet Component with Expandable Modal
function CodeSnippet() {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isExpanded]);

    return (
        <>
            <motion.div
                onClick={() => setIsExpanded(true)}
                className="cursor-pointer"
            >
                <div className="space-y-2 text-foreground/80">
                    <div><span className="text-accent">const</span> <span className="text-foreground">developer</span> = {'{'}</div>
                    <div className="ml-4"><span className="text-foreground/60">name:</span> <span className="text-green-400">"Developer"</span>,</div>
                    <div className="ml-4"><span className="text-foreground/60">status:</span> <span className="text-green-400">"Available"</span>,</div>
                    <div className="ml-4"><span className="text-foreground/60">focus:</span> [<span className="text-green-400">"web"</span>, <span className="text-green-400">"mobile"</span>],</div>
                    <div className="ml-4"><span className="text-foreground/60">graduating:</span> <span className="text-blue-400">2026</span>,</div>
                    <div>{'}'};</div>
                </div>
            </motion.div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsExpanded(false)}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2, ease: EASE_OUT }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-foreground/5 border border-foreground/10 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-auto"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="font-heading text-2xl font-bold">Developer Profile</h3>
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="text-foreground/60 hover:text-foreground transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-2 text-foreground/80 font-mono text-sm md:text-base mb-6">
                                <div><span className="text-accent">const</span> <span className="text-foreground">developer</span> = {'{'}</div>
                                <div className="ml-4"><span className="text-foreground/60">name:</span> <span className="text-green-400">"Developer"</span>,</div>
                                <div className="ml-4"><span className="text-foreground/60">status:</span> <span className="text-green-400">"Available"</span>,</div>
                                <div className="ml-4"><span className="text-foreground/60">focus:</span> [<span className="text-green-400">"web"</span>, <span className="text-green-400">"mobile"</span>],</div>
                                <div className="ml-4"><span className="text-foreground/60">graduating:</span> <span className="text-blue-400">2026</span>,</div>
                                <div className="ml-4"><span className="text-foreground/60">skills:</span> [<span className="text-green-400">"React"</span>, <span className="text-green-400">"TypeScript"</span>, <span className="text-green-400">"Node.js"</span>],</div>
                                <div className="ml-4"><span className="text-foreground/60">experience:</span> <span className="text-blue-400">3</span> <span className="text-foreground/60">years,</span></div>
                                <div className="ml-4"><span className="text-foreground/60">openToWork:</span> <span className="text-blue-400">true</span></div>
                                <div>{'}'};</div>
                            </div>

                            <p className="text-foreground/70 text-sm">
                                Click anywhere outside to close this expanded view. This modal demonstrates the iOS Dynamic Island-inspired interaction pattern.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="p-3 rounded-full border border-foreground/10 text-foreground/60 hover:text-accent hover:border-accent transition-all duration-300"
        >
            {icon}
        </a>
    );
}

// Availability Badge
function AvailabilityBadge() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono tracking-wider hover:border-accent/50 transition-colors duration-300 cursor-pointer"
        >
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <AnimatePresence mode="wait">
                {isExpanded ? (
                    <motion.span
                        key="expanded"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        Open for internships & contract work through 2026
                    </motion.span>
                ) : (
                    <motion.span
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        AVAILABLE FOR 2026
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

// Enhanced CTA Button
function ProjectsCTA() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.a
            href="#projects"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative px-8 py-4 bg-foreground text-background font-medium rounded-lg overflow-hidden"
        >
            <motion.div
                className="absolute inset-0 w-full h-full bg-accent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            <motion.span
                className="relative flex items-center gap-2"
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
            >
                <span className="text-sm">View Projects</span>

                <motion.div
                    animate={{
                        x: isHovered ? 2 : 0,
                        rotate: isHovered ? 15 : 0
                    }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                >
                    <ArrowRight size={18} />
                </motion.div>
            </motion.span>
        </motion.a>
    );
}
