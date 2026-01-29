"use client";

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedElement } from '@/components/shared/AnimatedElement';
import { EASE_OUT } from '@/lib/constants';
import { Experience } from '@/types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// --- Experience Section ---
export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const bgPath = containerRef.current?.querySelector('.timeline-path');
        const activePath = containerRef.current?.querySelector('.timeline-path-active') as SVGPathElement;
        const items = containerRef.current?.querySelectorAll('.experience-item');

        if (bgPath && activePath && items && items.length > 0) {
            // Calculate total height dynamically based on items
            const lastItem = items[items.length - 1] as HTMLElement;
            // Approximate height better to cover full list
            const totalHeight = lastItem.offsetTop + lastItem.offsetHeight + 100;

            gsap.set([bgPath, activePath], { attr: { d: `M 1 0 V ${totalHeight}` } });

            // Prepare for stroke animation
            const length = activePath.getTotalLength();
            gsap.set(activePath, {
                strokeDasharray: length,
                strokeDashoffset: length
            });

            // Animate the "active" path to draw down
            gsap.to(activePath, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 20%",
                    end: "bottom 20%",
                    scrub: 1,
                }
            });
        }

        // --- Added Entrance Animation ---
        // Animate the whole section entering like a card
        gsap.from(containerRef.current, {
            y: 100,
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 90%", // Start when top of section hits bottom 90% of viewport
                toggleActions: "play none none reverse"
            }
        });

    }, { scope: containerRef, dependencies: [experiences] });

    return (
        <div className="bg-white w-full relative z-10 pb-20"> {/* White container to visualize the card shape */}
            <section id="experience" className="py-20 md:py-32 bg-background border-t border-foreground/5 rounded-[40px] md:rounded-[60px] overflow-hidden mt-[-40px] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] relative z-20 mx-4 md:mx-6 lg:mx-10 min-h-[80vh]">
                <div className="max-w-[100rem] mx-auto px-4 md:px-12 relative" ref={containerRef}>
                    <AnimatedElement>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-16 md:mb-20 text-center">Experience Journey</h2>
                    </AnimatedElement>

                    {/* GSAP SVG Timeline */}
                    <svg className="absolute left-0 md:left-1/2 top-[120px] bottom-0 w-full h-[calc(100%-120px)] pointer-events-none hidden md:block -translate-x-1/2 overflow-visible">
                        <path
                            className="timeline-path"
                            d="M 1 0 V 2000" // Initial path, will be updated via JS
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="2"
                        />
                        <path
                            className="timeline-path-active"
                            d="M 1 0 V 2000" // Duplicate path for the "active" fill
                            fill="none"
                            stroke="#3b82f6" // Accent color (blue-500 approx)
                            strokeWidth="2"
                        />
                    </svg>

                    <div className="relative z-10 space-y-16 md:space-y-32">
                        {experiences.map((exp, index) => (
                            <ExperienceItem key={exp._id} experience={exp} index={index} isFirst={index === 0} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

// Experience Item with Hover Elevation
function ExperienceItem({ experience, index, isFirst }: { experience: Experience; index: number; isFirst: boolean }) {
    const isEven = index % 2 === 0;
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, margin: "-20% 0px" });

    return (
        <div ref={ref} className={`experience-item flex flex-col md:flex-row gap-8 md:gap-0 items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
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
                        className={`w-full md:w-4/5 p-8 rounded-[24px] bg-background/20 backdrop-blur-2xl border border-white/5 transition-colors duration-300 relative group shadow-[0_8px_32px_rgba(0,0,0,0.12)] ${isEven ? 'md:ml-12' : 'md:mr-12'}`}
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
