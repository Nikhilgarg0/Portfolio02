"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ExternalLink, Github, Terminal } from 'lucide-react';
import { AnimatedElement } from '@/components/shared/AnimatedElement';
import { EASE_OUT } from '@/lib/constants';
import { Projects } from '@/types';
import { Image } from '@/components/ui/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// --- Projects Section ---
export default function ProjectsSection({ projects }: { projects: Projects[] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Skew cards based on scroll velocity
        const cards = gsap.utils.toArray('.project-card-container') as HTMLElement[];

        cards.forEach((card) => {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.5,
                    onUpdate: (self) => {
                        const velocity = self.getVelocity();
                        const skew = Math.min(Math.max(velocity / -500, -5), 5); // Clamp skew
                        gsap.to(card, { skewY: skew, overwrite: 'auto', duration: 0.1 });
                    }
                }
            });
        });
    }, { scope: containerRef, dependencies: [projects] });

    return (
        <section id="projects" className="py-12 md:py-16 px-4 md:px-12 max-w-[120rem] mx-auto" ref={containerRef}>
            <AnimatedElement>
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 border-b border-foreground/10 pb-4 md:pb-6 gap-3">
                    <div>
                        <h2 className="font-heading text-xl md:text-3xl font-bold mb-2 md:mb-3">Selected Works</h2>
                        <p className="text-foreground/60 max-w-md text-sm md:text-base">
                            A collection of experiments, applications, and technical explorations.
                        </p>
                    </div>
                    <Link
                        href="/projects"
                        className="group flex items-center gap-2 text-accent hover:text-accent/80 transition-colors whitespace-nowrap text-sm md:text-base"
                    >
                        View All Projects <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                    </Link>
                </div>
            </AnimatedElement>

            <div className="space-y-12 md:space-y-20">
                {projects.map((project, index) => (
                    <ProjectCard key={project._id} project={project} index={index} />
                ))}
            </div>
        </section>
    );
}

// Project Card with Reveal Interaction
function ProjectCard({ project, index }: { project: Projects; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    // Smooth reveal using opacity only
    const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    const [isHovered, setIsHovered] = useState(false);
    const p = project as any;

    return (
        <motion.div
            ref={ref}
            style={{ opacity }}
            className={`project-card-container group md:min-h-[60vh] flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 md:gap-16 items-center`}
        >
            <div className="w-full lg:w-1/2">
                <AnimatedElement>
                    <div
                        className="bg-background/20 backdrop-blur-3xl border border-white/5 p-6 md:p-8 rounded-[24px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_-6px_rgba(0,0,0,0.4)] transition-all duration-500 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-zinc-500 text-xs md:text-sm">0{index + 1}</span>
                                <span className="font-mono text-accent text-xs md:text-sm uppercase tracking-wider px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
                                    {p.projectType || 'Development'}
                                </span>
                            </div>

                            <h3 className="font-heading text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                {p.projectName}
                            </h3>

                            <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl">
                                {p.projectDescription}
                            </p>

                            <motion.div
                                animate={{
                                    height: isHovered ? 'auto' : 0,
                                    opacity: isHovered ? 1 : 0,
                                    marginTop: isHovered ? 24 : 0
                                }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                            >
                                {p.architectureDetails && (
                                    <div className="text-sm text-zinc-400 border-l-2 border-accent/20 pl-4">
                                        <p className="font-medium text-zinc-300 mb-1">Architecture</p>
                                        {p.architectureDetails}
                                    </div>
                                )}
                            </motion.div>

                            <div className="flex flex-wrap gap-2 pt-4">
                                {p.techStack?.split(',').map((tech: string) => (
                                    <span key={tech} className="px-3 py-1.5 text-xs text-zinc-400 bg-white/5 border border-white/5 rounded-lg">
                                        {tech.trim()}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-6">
                                {p.githubLink && (
                                    <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-colors text-zinc-400">
                                        <Github size={20} />
                                    </a>
                                )}
                                {p.liveLink && (
                                    <a href={p.liveLink} target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-white text-black rounded-full font-medium text-sm flex items-center gap-2 hover:bg-white/90 transition-colors">
                                        Live Demo <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </AnimatedElement>
            </div>

            <div className="w-full lg:w-1/2">
                <motion.div
                    style={{ y }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    className="relative aspect-[16/10] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl group-hover:scale-[1.02] transition-transform duration-700"
                >
                    {p.mainScreenshot ? (
                        <Image
                            src={p.mainScreenshot}
                            alt={p.projectName || 'Project Preview'}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                            <Terminal size={48} className="text-zinc-700" />
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                </motion.div>
            </div>
        </motion.div>
    );
}
