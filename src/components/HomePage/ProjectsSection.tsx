"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ExternalLink, Github, Terminal } from 'lucide-react';
import { AnimatedElement } from '@/components/shared/AnimatedElement';
import { EASE_OUT } from '@/lib/constants';
import { Projects } from '@/types';
import { Image } from '@/components/ui/image';

// --- Projects Section ---
export default function ProjectsSection({ projects }: { projects: Projects[] }) {
    return (
        <section id="projects" className="py-20 md:py-32 px-4 md:px-12 max-w-[120rem] mx-auto">
            <AnimatedElement>
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 border-b border-foreground/10 pb-6 md:pb-8 gap-4">
                    <div>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 md:mb-4">Selected Works</h2>
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

            <div className="space-y-20 md:space-y-32">
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
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    const [isHovered, setIsHovered] = useState(false);

    // Extend project interface for mock data extra fields if needed, 
    // or cast safely because our types/index.ts is minimal currently.
    // The original project had architectureDetails etc. 
    // We'll treat them as optional on the project object using "any" or extend type if strict.
    // For now I'll cast project as any to access the extra fields not yet in my minimal interface
    const p = project as any;

    return (
        <div ref={ref} className="group relative grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center min-h-auto md:min-h-[60vh]">
            <div className={`order-2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                <AnimatedElement>
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="font-mono text-accent text-xs md:text-sm">0{index + 1}</span>
                            <div className="h-px w-8 md:w-12 bg-accent/30" />
                            <span className="font-mono text-foreground/40 text-xs md:text-sm uppercase tracking-wider">{p.projectType || 'Development'}</span>
                        </div>

                        <h3 className="font-heading text-2xl md:text-5xl font-bold group-hover:text-accent transition-colors duration-300">
                            {p.projectName}
                        </h3>

                        <p className="text-base md:text-lg text-foreground/70 leading-relaxed max-w-xl">
                            {p.projectDescription}
                        </p>

                        <motion.div
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                height: isHovered ? 'auto' : 0,
                                marginTop: isHovered ? 16 : 0
                            }}
                            transition={{ duration: 0.4, ease: EASE_OUT }}
                            className="overflow-hidden"
                        >
                            {p.architectureDetails && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
                                    transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.05 }}
                                    className="p-4 bg-foreground/5 border border-foreground/10 rounded-lg"
                                >
                                    <p className="text-xs font-mono text-accent/70 uppercase tracking-wider mb-2">Architecture</p>
                                    <p className="text-sm text-foreground/60">{p.architectureDetails}</p>
                                </motion.div>
                            )}
                            {p.designDecisions && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
                                    transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
                                    className="mt-3 p-4 bg-foreground/5 border border-foreground/10 rounded-lg"
                                >
                                    <p className="text-xs font-mono text-accent/70 uppercase tracking-wider mb-2">Design Decisions</p>
                                    <p className="text-sm text-foreground/60">{p.designDecisions}</p>
                                </motion.div>
                            )}
                        </motion.div>

                        <div className="flex flex-wrap gap-2 md:gap-3 pt-4">
                            {p.techStack?.split(',').map((tech: string) => (
                                <span key={tech} className="px-3 py-1 text-xs border border-foreground/10 rounded-md text-foreground/60">
                                    {tech.trim()}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-4 md:gap-6 pt-6 md:pt-8 flex-wrap">
                            {p.githubLink && (
                                <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs md:text-sm font-medium hover:text-accent transition-colors">
                                    <Github size={18} /> Source Code
                                </a>
                            )}
                            {p.liveLink && (
                                <a href={p.liveLink} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-xs md:text-sm font-medium hover:text-accent transition-colors">
                                    <ExternalLink size={18} /> Live Demo
                                </a>
                            )}
                        </div>
                    </div>
                </AnimatedElement>
            </div>

            <div className={`order-1 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                <motion.div
                    style={{ y, opacity }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    className="relative aspect-video rounded-xl overflow-hidden bg-foreground/5 border border-foreground/10 group-hover:border-accent/30 transition-colors duration-500"
                >
                    {p.mainScreenshot ? (
                        <Image
                            src={p.mainScreenshot}
                            alt={p.projectName || 'Project Preview'}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-foreground/5">
                            <Terminal size={48} className="text-foreground/20" />
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent opacity-60" />
                </motion.div>
            </div>
        </div>
    );
}
