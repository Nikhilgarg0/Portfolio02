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
export default function AboutSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

    return (
        <section id="about" className="py-20 md:py-32 px-4 md:px-12 max-w-[120rem] mx-auto" ref={containerRef}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
                <div className="lg:col-span-4">
                    <AnimatedElement>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 md:mb-8 flex items-center gap-4">
                            <span className="w-8 md:w-12 h-[1px] bg-accent"></span>
                            About
                        </h2>
                        <ImageWithParallax imageY={imageY} />
                    </AnimatedElement>
                </div>

                <div className="lg:col-span-8 flex flex-col justify-start">
                    <AnimatedElement delay={200}>
                        <p className="font-heading text-xl md:text-3xl leading-relaxed text-foreground/90 mb-12 md:mb-16">
                            Full-stack and mobile developer with hands-on experience in MERN, React Native, and Kotlin. Skilled in building scalable applications, integrating AI features, and optimizing backend workflows.
                        </p>
                    </AnimatedElement>

                    <AnimatedElement delay={300}>
                        <CraftSection />
                    </AnimatedElement>

                    <AnimatedElement delay={400}>
                        <StackSection />
                    </AnimatedElement>
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
            className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-foreground/5 border border-foreground/10"
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
                className="absolute inset-0 bg-accent pointer-events-none"
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
            className="mb-16 pb-16 border-b border-foreground/10"
        >
            <div className="space-y-6">
                <motion.div
                    animate={{ opacity: isFocused ? 1 : 0.7 }}
                    transition={{ duration: 0.2 }}
                    className="w-12 h-12 rounded-lg bg-accent/15 flex items-center justify-center text-accent"
                >
                    <Code2 size={28} />
                </motion.div>

                <h3 className="font-heading text-3xl font-bold text-foreground">
                    My Focus
                </h3>

                <motion.p
                    animate={{ color: isFocused ? '#E0E0E0' : '#999999' }}
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
                className="mt-1.5 h-px bg-accent flex-shrink-0"
            />
            <div>
                <span className="font-mono text-sm font-semibold text-accent">{label}</span>
                <p className="text-foreground/60 text-sm mt-1">{desc}</p>
            </div>
        </motion.li>
    );
}

// The Stack Section
function StackSection() {
    const [hoveredTech, setHoveredTech] = useState<string | null>(null);

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
        { name: 'Git', category: 'Tool' }
    ];

    return (
        <div className="space-y-6">
            <h3 className="font-heading text-lg font-semibold text-foreground/70 uppercase tracking-wide">
                Skills & Technologies
            </h3>

            <div className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                    <motion.div
                        key={tech.name}
                        onMouseEnter={() => setHoveredTech(tech.name)}
                        onMouseLeave={() => setHoveredTech(null)}
                        animate={{
                            opacity: hoveredTech === tech.name ? 1 : 0.6,
                            borderColor: hoveredTech === tech.name ? '#007BFF' : 'rgba(255,255,255,0.05)',
                            backgroundColor: hoveredTech === tech.name ? 'rgba(0, 123, 255, 0.1)' : 'rgba(255,255,255,0.02)'
                        }}
                        transition={{ duration: 0.2 }}
                        className="px-4 py-2 text-sm font-mono border backdrop-blur-md rounded-full text-foreground/60 cursor-default"
                    >
                        {tech.name}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
