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
            const firstItem = items[0] as HTMLElement;
            const lastItem = items[items.length - 1] as HTMLElement;

            // Calculate from first item to last item with padding
            const startY = firstItem.offsetTop;
            const endY = lastItem.offsetTop + lastItem.offsetHeight;
            const totalHeight = endY - startY + 50; // Extra padding at end

            gsap.set([bgPath, activePath], { attr: { d: `M 0 0 V ${totalHeight}` } });

            // Prepare for stroke animation
            const length = activePath.getTotalLength();
            gsap.set(activePath, {
                strokeDasharray: length,
                strokeDashoffset: length
            });

            // Animate the "active" path to draw down with smoother timing
            gsap.to(activePath, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "bottom center",
                    scrub: 0.5, // Smoother scrubbing
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
        <div className="bg-white w-full relative z-10 pb-12 md:pb-16"> {/* White container to visualize the card shape */}
            <section id="experience" className="py-8 md:py-10 lg:py-12 bg-background border-t border-foreground/5 rounded-[20px] md:rounded-[32px] lg:rounded-[40px] overflow-hidden mt-[-20px] md:mt-[-30px] shadow-[0_-15px_50px_rgba(0,0,0,0.15)] relative z-20 mx-2 sm:mx-3 md:mx-6 lg:mx-8 min-h-[40vh] md:min-h-[50vh]">
                <div className="max-w-[100rem] mx-auto px-4 md:px-8 lg:px-12 relative" ref={containerRef}>
                    <AnimatedElement>
                        <h2 className="font-heading text-xl sm:text-2xl md:text-2xl font-bold mb-6 md:mb-8 lg:mb-12 text-center">Experience Journey</h2>
                    </AnimatedElement>

                    {/* GSAP SVG Timeline - Positioned at middle of right half */}
                    <svg className="absolute left-1/4 top-[20px] w-[2px] pointer-events-none hidden md:block overflow-visible" style={{ height: 'calc(100% - 100px)' }}>
                        <path
                            className="timeline-path"
                            d="M 0 0 V 2000" // Initial path, will be updated via JS
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="2"
                        />
                        <path
                            className="timeline-path-active"
                            d="M 0 0 V 2000" // Duplicate path for the "active" fill
                            fill="none"
                            stroke="#3b82f6" // Accent color (blue-500 approx)
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="relative z-10 space-y-10 md:space-y-20">
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
                        className={`w-full md:w-4/5 p-5 md:p-8 rounded-[20px] md:rounded-[24px] bg-background/20 backdrop-blur-2xl border border-white/5 transition-colors duration-300 relative group shadow-[0_8px_32px_rgba(0,0,0,0.12)] ${isEven ? 'md:ml-12' : 'md:mr-12'}`}
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

                        <span className="inline-block px-3 py-1 mb-3 md:mb-4 text-[10px] sm:text-xs font-mono text-accent bg-accent/5 rounded-full">
                            {experience.startDate ? new Date(experience.startDate).getFullYear() : 'Present'}
                        </span>

                        <h3 className="font-heading text-base sm:text-lg font-bold mb-1">{experience.title}</h3>
                        <p className="text-xs sm:text-sm text-foreground/80 mb-2 md:mb-3">{experience.organizationName}</p>

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

