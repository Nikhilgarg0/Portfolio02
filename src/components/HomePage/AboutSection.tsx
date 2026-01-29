"use client";

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { AnimatedElement } from '@/components/shared/AnimatedElement';
import { EASE_OUT } from '@/lib/constants';
import { Image } from '@/components/ui/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- About Section ---
// --- About Section ---
export default function AboutSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const skillsTrackRef = useRef<HTMLDivElement>(null);

    // Parallax effect removed to prevent conflict with GSAP pinning
    const imageY = 0;

    useGSAP(() => {
        if (!sectionRef.current || !skillsTrackRef.current || !contentRef.current) return;

        const skillsTrack = skillsTrackRef.current;
        const section = sectionRef.current;
        const content = contentRef.current;

        // Calculate scroll distance for skills
        // We do this inside a specialized function or on refresh to ensure accuracy
        const getScrollDistance = () => skillsTrack.scrollWidth - section.offsetWidth;

        // Create a specific timeline for the About Section
        ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "+=2500", // Adjust this value to control the speed/duration of the scroll
            pin: content, // Pin the inner content instead of the root section to avoid React 'removeChild' errors
            scrub: 1,
            onUpdate: (self) => {
                // Manual timeline control for better precision mixing horizontal scroll + shrink
                const progress = self.progress;
                const scrollDistance = getScrollDistance();

                // Phase 1: Scroll Skills (0% to 70% of the pin duration)
                const scrollPhase = 0.7;

                if (progress <= scrollPhase) {
                    // Map 0-0.7 progress to actual scroll distance
                    const moveProgress = progress / scrollPhase;
                    gsap.set(skillsTrack, { x: -scrollDistance * moveProgress });

                    // Reset shrink effects if we scroll back up
                    gsap.set(content, { scale: 1, opacity: 1, filter: "blur(0px)", y: 0 });
                } else {
                    // Ensure skills are fully scrolled
                    gsap.set(skillsTrack, { x: -scrollDistance });

                    // Phase 2: Shrink and Fade Content (70% to 100%)
                    const shrinkProgress = (progress - scrollPhase) / (1 - scrollPhase);

                    // Shrink scale: 1 -> 0.9
                    // Opacity: 1 -> 0
                    // Blur: 0 -> 10px
                    // Y: 0 -> -50px (slight lift while fading)
                    gsap.set(content, {
                        scale: 1 - (shrinkProgress * 0.1),
                        opacity: 1 - shrinkProgress,
                        filter: `blur(${shrinkProgress * 10}px)`,
                        y: -shrinkProgress * 50
                    });
                }
            }
        });

    }, { scope: sectionRef });

    return (
        <section id="about" className="bg-white overflow-hidden" ref={sectionRef}>
            <div ref={contentRef} className="py-20 md:py-32 px-4 md:px-12 max-w-[120rem] mx-auto w-full h-full flex flex-col justify-center">

                {/* Skills section moved to top above About heading */}
                <AnimatedElement delay={100} className="mb-16 md:mb-24">
                    <StackSection trackRef={skillsTrackRef} />
                </AnimatedElement>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
                    <div className="lg:col-span-4">
                        <AnimatedElement>
                            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 md:mb-8 flex items-center gap-4 text-gray-900">
                                <span className="w-8 md:w-12 h-[1px] bg-blue-500"></span>
                                About
                            </h2>
                            <ImageWithParallax imageY={imageY} />
                        </AnimatedElement>
                    </div>

                    <div className="lg:col-span-8 flex flex-col justify-start">
                        <AnimatedElement delay={200}>
                            <p className="font-heading text-xl md:text-3xl leading-relaxed text-gray-800 mb-12 md:mb-16">
                                Full-stack and mobile developer with hands-on experience in MERN, React Native, and Kotlin. Skilled in building scalable applications, integrating AI features, and optimizing backend workflows.
                            </p>
                        </AnimatedElement>

                        <AnimatedElement delay={300}>
                            <CraftSection />
                        </AnimatedElement>
                    </div>
                </div>
            </div>
        </section>
    );
}


// Image with Parallax
function ImageWithParallax({ imageY }: { imageY: any }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            style={{ y: imageY }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200"
        >
            <motion.div
                animate={{ scale: isHovered ? 1.02 : 1 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="w-full h-full"
            >
                <Image
                    src="https://static.wixstatic.com/media/445dc7_21ec1884c0d540bfaa549a9aaf780056~mv2.png?originWidth=768&originHeight=960"
                    alt="Nikhil Garg"
                    className="w-full h-full object-cover opacity-75"
                />
            </motion.div>

            <motion.div
                animate={{ opacity: isHovered ? 0.08 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-blue-500 pointer-events-none"
            />
        </motion.div>
    );
}

// The Craft Section
function CraftSection() {
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".craft-item", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        });
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => setIsFocused(false)}
            className="mb-16 pb-16 border-b border-gray-200"
        >
            <div className="space-y-6">
                <motion.div
                    animate={{ opacity: isFocused ? 1 : 0.7 }}
                    transition={{ duration: 0.2 }}
                    className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"
                >
                    <Code2 size={28} />
                </motion.div>

                <h3 className="font-heading text-3xl font-bold text-gray-900">
                    My Focus
                </h3>

                <motion.p
                    animate={{ color: isFocused ? '#1f2937' : '#6b7280' }}
                    transition={{ duration: 0.2 }}
                    className="text-lg leading-relaxed max-w-2xl"
                >
                    I focus on creating impactful digital products with clean architecture and maintainable code. I prioritize:
                </motion.p>

                <ul className="space-y-3 mt-6">
                    {[
                        { label: 'User-Centric', desc: 'Developing products that solve real problems for users' },
                        { label: 'Scalability', desc: 'Building systems that can grow and handle load' },
                        { label: 'Automation', desc: 'Optimizing workflows and backend processes' }
                    ].map((item) => (
                        <CraftPrinciple key={item.label} label={item.label} desc={item.desc} isFocused={isFocused} />
                    ))}
                </ul>
            </div>
        </div>
    );
}

// Individual Craft Principle
function CraftPrinciple({ label, desc, isFocused }: { label: string; desc: string; isFocused: boolean }) {
    return (
        <motion.li
            animate={{ opacity: isFocused ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-3 group craft-item"
        >
            <motion.span
                animate={{ width: isFocused ? 24 : 16 }}
                transition={{ duration: 0.2 }}
                className="mt-1.5 h-px bg-blue-500 flex-shrink-0"
            />
            <div>
                <span className="font-mono text-sm font-semibold text-blue-600">{label}</span>
                <p className="text-gray-600 text-sm mt-1">{desc}</p>
            </div>
        </motion.li>
    );
}

// The StackSection with Horizontal Scroll Animation
function StackSection({ trackRef }: { trackRef: React.RefObject<HTMLDivElement | null> }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const technologies = [
        { name: 'MERN', category: 'Stack' },
        { name: 'React Native', category: 'Mobile' },
        { name: 'Kotlin', category: 'Mobile' },
        { name: 'Java', category: 'Language' },
        { name: 'Python', category: 'Language' },
        { name: 'C++', category: 'Language' },
        { name: 'Expo', category: 'Mobile' },
        { name: 'Android Studio', category: 'Tool' },
        { name: 'Firebase', category: 'Cloud' },
        { name: 'Supabase', category: 'Cloud' },
        { name: 'Google Cloud', category: 'Cloud' },
        { name: 'Git', category: 'Tool' },
        // Duplicate for more scroll distance
        { name: 'TypeScript', category: 'Language' },
        { name: 'Next.js', category: 'Framework' },
        { name: 'Tailwind CSS', category: 'Styling' },
        { name: 'Node.js', category: 'Runtime' },
        { name: 'Express', category: 'Framework' },
        { name: 'MongoDB', category: 'Database' },
        { name: 'Docker', category: 'Tool' },
        { name: 'AWS', category: 'Cloud' },
        { name: 'Figma', category: 'Design' },
        { name: 'Redux', category: 'State' },
        { name: 'Graphql', category: 'API' },
        { name: 'PostgreSQL', category: 'Database' },
    ];

    // Calculate scale based on distance from hovered item
    const getScale = (index: number) => {
        if (hoveredIndex === null) return 1;
        const distance = Math.abs(index - hoveredIndex);
        if (distance === 0) return 1.3; // Hovered item (Mac-style)
        if (distance === 1) return 1.15; // Adjacent items
        return 1; // Normal size
    };

    return (
        <div className="w-full relative">
            <h3 className="font-heading text-lg font-semibold text-gray-700 uppercase tracking-wide mb-6 pl-4">
                Skills & Technologies
            </h3>

            {/* Mask image for fade effect at both ends */}
            <div
                className="overflow-hidden w-full relative"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                }}
            >
                <div
                    ref={trackRef}
                    className="flex gap-6 w-max items-center pl-32 pr-32" /* Increased padding for the blank space */
                >
                    {technologies.map((tech, index) => (
                        <motion.div
                            key={`${tech.name}-${index}`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            animate={{
                                scale: getScale(index),
                                opacity: hoveredIndex === null ? 0.6 : (hoveredIndex === index ? 1 : 0.5),
                                borderColor: hoveredIndex === index ? '#3b82f6' : 'rgba(0,0,0,0.1)',
                                backgroundColor: hoveredIndex === index ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.02)',
                                y: hoveredIndex === index ? -5 : 0, // Slight lift on hover
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                            className="px-6 py-2 text-base font-mono border backdrop-blur-md rounded-full text-gray-700 cursor-default whitespace-nowrap flex-shrink-0"
                            style={{
                                fontFamily: 'Courier New, monospace',
                                transformOrigin: 'bottom center'
                            }}
                        >
                            {tech.name}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
