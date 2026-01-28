"use client";

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { AnimatedElement } from '@/components/shared/AnimatedElement';
import { EASE_OUT } from '@/lib/constants';
import { Image } from '@/components/ui/image';

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
                            I design systems that scale. Every decision prioritizes <span className="text-accent">readability, maintainability, and performance</span> over expedience.
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
                    alt="Developer working"
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

    return (
        <div
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
                    The Craft
                </h3>

                <motion.p
                    animate={{ color: isFocused ? '#E0E0E0' : '#999999' }}
                    transition={{ duration: 0.2 }}
                    className="text-lg leading-relaxed max-w-2xl"
                >
                    I approach every problem as a systems design challenge. Code is communication—clarity and structure matter as much as functionality. I prioritize:
                </motion.p>

                <ul className="space-y-3 mt-6">
                    {[
                        { label: 'Readability', desc: 'Code that explains itself through clear naming and structure' },
                        { label: 'Scalability', desc: 'Architectures that grow without technical debt' },
                        { label: 'Maintainability', desc: 'Systems designed for future developers, including myself' }
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
            className="flex items-start gap-3 group"
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
        { name: 'React', category: 'Frontend' },
        { name: 'TypeScript', category: 'Language' },
        { name: 'Node.js', category: 'Runtime' },
        { name: 'PostgreSQL', category: 'Database' },
        { name: 'Tailwind', category: 'Styling' },
        { name: 'Git', category: 'VCS' }
    ];

    return (
        <div className="space-y-6">
            <h3 className="font-heading text-lg font-semibold text-foreground/70 uppercase tracking-wide">
                Tools & Technologies
            </h3>

            <div className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                    <motion.div
                        key={tech.name}
                        onMouseEnter={() => setHoveredTech(tech.name)}
                        onMouseLeave={() => setHoveredTech(null)}
                        animate={{
                            opacity: hoveredTech === tech.name ? 1 : 0.6,
                            borderColor: hoveredTech === tech.name ? '#007BFF' : '#333333'
                        }}
                        transition={{ duration: 0.2 }}
                        className="px-4 py-2 text-sm font-mono border border-foreground/20 rounded-md text-foreground/60 cursor-default"
                    >
                        {tech.name}
                    </motion.div>
                ))}
            </div>

            <p className="text-xs text-foreground/40 mt-6">
                Tools evolve. Systems thinking is timeless.
            </p>
        </div>
    );
}
