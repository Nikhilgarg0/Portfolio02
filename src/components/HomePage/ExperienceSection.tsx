"use client";

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedElement } from '@/components/shared/AnimatedElement';
import { EASE_OUT } from '@/lib/constants';
import { Experience } from '@/types';

// --- Experience Section ---
export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
    return (
        <section id="experience" className="py-20 md:py-32 bg-foreground/[0.02] border-y border-foreground/5">
            <div className="max-w-[100rem] mx-auto px-4 md:px-12">
                <AnimatedElement>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-16 md:mb-20 text-center">Experience Journey</h2>
                </AnimatedElement>

                <div className="relative">
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-foreground/10 -translate-x-1/2 hidden md:block" />

                    <div className="space-y-16 md:space-y-24">
                        {experiences.map((exp, index) => (
                            <ExperienceItem key={exp._id} experience={exp} index={index} isFirst={index === 0} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Experience Item with Hover Elevation
function ExperienceItem({ experience, index, isFirst }: { experience: Experience; index: number; isFirst: boolean }) {
    const isEven = index % 2 === 0;
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, margin: "-20% 0px" });

    return (
        <div ref={ref} className={`flex flex-col md:flex-row gap-8 md:gap-0 items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1 w-full md:w-1/2">
                <AnimatedElement delay={index * 100} className={`flex ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                    <motion.div
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                        animate={{
                            y: isInView ? -8 : 0,
                            boxShadow: isInView
                                ? '0 20px 40px rgba(0, 123, 255, 0.15)'
                                : '0 0px 0px rgba(0, 0, 0, 0)',
                            scale: isInView ? 1.02 : 1
                        }}
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                        className={`w-full md:w-4/5 p-8 rounded-2xl bg-background border border-foreground/5 transition-colors duration-300 relative group ${isEven ? 'md:ml-12' : 'md:mr-12'}`}
                    >
                        <div className={`absolute top-1/2 w-12 h-px bg-accent/30 hidden md:block ${isEven ? '-left-12' : '-right-12'}`} />

                        <motion.div
                            animate={{
                                scale: isFirst || isInView ? 1.4 : 1,
                                backgroundColor: isFirst || isInView ? '#007BFF' : '#666666'
                            }}
                            transition={{ duration: 0.4, ease: EASE_OUT }}
                            className={`absolute top-1/2 w-3 h-3 rounded-full hidden md:block ${isEven ? '-left-[54px]' : '-right-[54px]'} translate-y-[-50%]`}
                        />

                        <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-accent bg-accent/5 rounded-full">
                            {experience.startDate ? new Date(experience.startDate).getFullYear() : 'Present'}
                        </span>

                        <h3 className="font-heading text-2xl font-bold mb-1">{experience.title}</h3>
                        <p className="text-lg text-foreground/80 mb-4">{experience.organizationName}</p>

                        {experience.description && (
                            <p className="text-foreground/60 leading-relaxed text-sm">
                                {experience.description}
                            </p>
                        )}
                    </motion.div>
                </AnimatedElement>
            </div>
            <div className="hidden md:block w-px" />
            <div className="flex-1 w-full md:w-1/2" />
        </div>
    );
}
