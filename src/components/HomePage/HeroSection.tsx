"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import { EASE_OUT } from '@/lib/constants';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useSmoothScroll } from '@/components/ui/smooth-scroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Hero Section ---
export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const nameRef = useRef<HTMLHeadingElement>(null);

    // GSAP Intro & Scroll Animation
    useGSAP(() => {
        const tl = gsap.timeline();

        // Intro Animation (Inner Elements)
        tl.fromTo(".hero-text-char",
            {
                y: 100,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.05,
                ease: "power4.out"
            })
            .fromTo(".hero-fade-in-item",
                {
                    y: 20,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out"
                }, "-=0.5");

        // Scroll Zoom Transition
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=1500", // Snappier scroll duration
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    // Turn off blinking during scroll
                    if (cursorRef.current) {
                        if (self.progress > 0.01) {
                            cursorRef.current.classList.remove('animate-cursor-blink');
                            cursorRef.current.style.opacity = '1';
                        } else {
                            cursorRef.current.classList.add('animate-cursor-blink');
                        }
                    }
                }
            }
        });

        // Zoom Animation
        scrollTl
            // Step 1: Cursor grows massive
            .to(cursorRef.current, {
                scale: 500,
                backgroundColor: "#FFFFFF",
                duration: 2,
                ease: "power2.inOut",
                force3D: true
            })
            // Step 2: Content moves UP in sync
            .to([".hero-scroll-fade-wrapper"],
                {
                    y: -300, // Move significantly up
                    scale: 1.1,
                    duration: 2, // Match cursor duration
                    stagger: 0.05,
                    ease: "power1.in" // Accelerate with the zoom
                },
                "<") // Start EXACTLY when cursor starts

            // Step 3: Ensure background fades out so we transition to pure white
            .to(".hero-bg-elements",
                {
                    opacity: 0,
                    duration: 1 // Fade out smoother
                },
                "<");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden pt-24 md:pt-32 pb-10 md:pb-16 px-4 md:px-12 bg-background isolate">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none hero-bg-elements">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[150px] w-[150px] md:h-[250px] md:w-[250px] rounded-full bg-accent/20 opacity-20 blur-[100px]" />
            </div>

            <div className="z-10 w-full max-w-5xl relative flex flex-col items-center">
                <div className="flex justify-center mb-6 md:mb-10 hero-scroll-fade-wrapper relative z-0 mix-blend-difference text-white">
                    <div className="hero-fade-in-item">
                        <AvailabilityBadge />
                    </div>
                </div>

                <div ref={textRef} className="text-center mb-3 md:mb-5 relative z-0">
                    <h1 ref={nameRef} className="font-heading text-4xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] font-bold flex flex-wrap justify-center items-center gap-2 md:gap-4">
                        {/* Wrapper for Name Text Fade */}
                        <span className="hero-scroll-fade-wrapper flex flex-wrap justify-center items-center gap-2 md:gap-4 mix-blend-difference text-white">
                            <div className="overflow-hidden flex items-center">
                                <span className="hero-text-char inline-block">NIKHIL</span>
                            </div>
                            <div className="overflow-hidden flex items-center">
                                <span className="hero-text-char inline-block">GARG</span>
                            </div>
                        </span>

                        {/* Terminal Cursor positioned next to Name - OUTSIDE the fade wrapper */}
                        {/* Mix-blend-difference requires Z-Index higher than backgrounds but needs to interact with text underneath */}
                        <span
                            ref={cursorRef}
                            className="inline-block w-4 h-10 md:w-8 md:h-20 bg-white rounded-sm animate-cursor-blink origin-center relative z-50 mix-blend-difference"
                        />
                    </h1>

                    <div className="hero-scroll-fade-wrapper text-accent mt-4 font-mono text-base md:text-xl flex items-center justify-center gap-2 flex-wrap opacity-80 relative z-0 mix-blend-difference">
                        <div className="hero-fade-in-item flex gap-2">
                            <span className="inline-block">Full-Stack</span> <span className="inline-block">&</span> <span className="inline-block">Mobile</span> <span className="inline-block">Developer</span>
                        </div>
                    </div>
                </div>

                {/* Content Wrapper for Scroll Fade */}
                <div className="hero-scroll-fade-wrapper w-full flex flex-col items-center relative z-0 mix-blend-difference">
                    <p className="text-center text-sm md:text-lg text-foreground/70 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2 hero-fade-in-item relative z-0 text-white">
                        Passionate about user-centric product development, automation, and delivering reliable cloud-based solutions.
                    </p>

                    <div className="mb-8 md:mb-12 bg-zinc-700/80 border border-foreground/10 rounded-[20px] p-3 md:p-6 font-mono text-xs md:text-sm overflow-x-auto group hover:border-accent/30 hover:bg-zinc-600 transition-all duration-500 hero-fade-in-item relative z-0 w-full mix-blend-normal">
                        <div className="flex gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500/60" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                            <div className="w-3 h-3 rounded-full bg-green-500/60" />
                        </div>
                        <CodeSnippet />
                        <p className="text-xs text-foreground/40 mt-4 text-center">Click to expand</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-10 md:mb-12 hero-fade-in-item relative z-0">
                        <ProjectsCTA />
                        <a href="#contact" className="px-6 py-3 border border-foreground/20 rounded-full text-foreground/70 hover:border-accent hover:text-accent transition-all duration-300 font-medium text-sm md:text-base">
                            Get in Touch
                        </a>
                    </div>

                    <div className="flex justify-center gap-4 md:gap-6 hero-fade-in-item relative z-0">
                        <SocialLink href="https://github.com/Nikhilgarg0" icon={<Github size={20} />} label="GitHub" />
                        <SocialLink href="https://www.linkedin.com/in/Nikhil-garg8982" icon={<Linkedin size={20} />} label="LinkedIn" />
                        <SocialLink href="mailto:official.nikhilgarg@gmail.com" icon={<Mail size={20} />} label="Email" />
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="hero-fade-in-item absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-foreground/40 z-20"
            >
                <ChevronDown size={24} />
            </motion.div>
        </section>
    );
}

import { createPortal } from 'react-dom';

// ... existing imports ...

// Code Snippet Component with Expandable Modal
function CodeSnippet() {
    const [isExpanded, setIsExpanded] = useState(false);
    const { lenis } = useSmoothScroll();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isExpanded) {
            lenis?.stop();
            document.body.style.overflow = 'hidden';
        } else {
            lenis?.start();
            document.body.style.overflow = 'unset';
        }
        return () => {
            lenis?.start();
            document.body.style.overflow = 'unset';
        };
    }, [isExpanded, lenis]);

    return (
        <>
            <motion.div
                onClick={() => setIsExpanded(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer relative z-10"
            >
                <div className="space-y-2 text-foreground/80">
                    <div><span className="text-accent">const</span> <span className="text-foreground">developer</span> = {'{'}</div>
                    <div className="ml-4"><span className="text-foreground/60">name:</span> <span className="text-green-400">"Nikhil Garg"</span>,</div>
                    <div className="ml-4"><span className="text-foreground/60">role:</span> <span className="text-green-400">"Full-Stack & Mobile Developer"</span>,</div>
                    <div className="ml-4"><span className="text-foreground/60">skills:</span> [<span className="text-green-400">"MERN"</span>, <span className="text-green-400">"React Native"</span>, <span className="text-green-400">"Kotlin"</span>],</div>
                    <div className="ml-4"><span className="text-foreground/60">status:</span> <span className="text-green-400">"Open to work"</span>,</div>
                    <div>{'}'};</div>
                </div>
            </motion.div>

            {mounted && createPortal(
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsExpanded(false)}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/20 backdrop-blur-sm"
                            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-background/90 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-[32px] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto overflow-x-hidden relative"
                            >
                                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background/20 to-transparent pointer-events-none" />

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div>
                                        <h3 className="font-heading text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                            Developer Profile
                                        </h3>
                                        <p className="text-xs text-foreground/50 font-mono mt-1">READ-ONLY • JSON</p>
                                    </div>
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-foreground/70"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-3 text-foreground/90 font-mono text-sm md:text-base mb-8 relative z-10">
                                    <div><span className="text-purple-400">const</span> <span className="text-yellow-200">developer</span> = {'{'}</div>
                                    <div className="ml-6"><span className="text-foreground/50">name:</span> <span className="text-green-400">"Nikhil Garg"</span>,</div>
                                    <div className="ml-6"><span className="text-foreground/50">role:</span> <span className="text-green-400">"Full-Stack & Mobile Developer"</span>,</div>
                                    <div className="ml-6"><span className="text-foreground/50">education:</span> <span className="text-green-400">"B.Tech in CS, Medicaps University"</span>,</div>
                                    <div className="ml-6"><span className="text-foreground/50">focus:</span> [<span className="text-green-400">"Web"</span>, <span className="text-green-400">"Mobile"</span>, <span className="text-green-400">"AI Integration"</span>],</div>
                                    <div className="ml-6"><span className="text-foreground/50">core_skills:</span> [</div>
                                    <div className="ml-10"><span className="text-green-400">"MERN"</span>, <span className="text-green-400">"React Native"</span>,</div>
                                    <div className="ml-10"><span className="text-green-400">"Kotlin"</span>, <span className="text-green-400">"Java"</span>, <span className="text-green-400">"Python"</span></div>
                                    <div className="ml-6">],</div>
                                    <div className="ml-6"><span className="text-foreground/50">tools:</span> [<span className="text-green-400">"Git"</span>, <span className="text-green-400">"Firebase"</span>, <span className="text-green-400">"Supabase"</span>, <span className="text-green-400">"GCP"</span>],</div>
                                    <div className="ml-6"><span className="text-foreground/50">openToWork:</span> <span className="text-blue-400">true</span></div>
                                    <div>{'}'};</div>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-foreground/40">
                                    <span>Ln 1, Col 1</span>
                                    <span>UTF-8</span>
                                    <span>TypeScript</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
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
                        Open to work
                    </motion.span>
                ) : (
                    <motion.span
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        AVAILABLE FOR HIRE
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
            className="group relative px-8 py-4 bg-foreground text-background font-medium rounded-full overflow-hidden"
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
