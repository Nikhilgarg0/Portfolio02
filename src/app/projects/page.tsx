"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { BaseCrudService } from '@/lib/data';
import { Projects } from '@/types';
import { Image } from '@/components/ui/image';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Projects[]>([]);
    const [selectedProject, setSelectedProject] = useState<Projects | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchProjects = async () => {
            const { items } = await BaseCrudService.getAll<Projects>('projects');
            setProjects(items);
            if (items.length > 0) {
                setSelectedProject(items[0]);
            }
        };

        fetchProjects();
    }, []);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className="bg-background text-foreground min-h-screen font-paragraph">
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-foreground/10">
                <nav className="max-w-[120rem] mx-auto px-8 py-6 flex justify-between items-center">
                    <Link href="/" className="font-heading text-xl font-bold flex items-center gap-2 hover:text-accent transition-colors duration-300">
                        <ArrowLeft size={20} />
                        Back
                    </Link>
                    <div className="flex gap-8 items-center">
                        <Link href="/" className="font-paragraph text-sm hover:text-accent transition-colors duration-300">
                            Home
                        </Link>
                        <Link href="/resume" className="font-paragraph text-sm hover:text-accent transition-colors duration-300">
                            Resume
                        </Link>
                    </div>
                </nav>
            </header>

            <div className="pt-32 pb-16 px-8">
                <div className="max-w-[120rem] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        <h1 className="font-heading text-5xl font-bold mb-4">Projects</h1>
                        <p className="font-paragraph text-lg text-foreground/70 mb-16 max-w-3xl">
                            Interactive exploration of selected work. Each project represents a deliberate focus on architecture, user experience, and engineering discipline.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                            className="lg:col-span-4 space-y-4"
                        >
                            <h2 className="font-heading text-2xl font-semibold mb-6">All Projects</h2>
                            {projects.map((project, index) => (
                                <motion.button
                                    key={project._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                                    onClick={() => setSelectedProject(project)}
                                    className={`w-full text-left p-6 border rounded-lg transition-all duration-300 ${selectedProject?._id === project._id
                                            ? 'bg-accent/10 border-accent'
                                            : 'bg-foreground/[0.02] border-foreground/10 hover:border-accent/30'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-heading text-xl font-semibold">
                                            {project.projectName}
                                        </h3>
                                        {project.projectType && (
                                            <span className="font-paragraph text-xs px-3 py-1 bg-accent/10 text-accent rounded-full">
                                                {project.projectType}
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-paragraph text-sm text-foreground/60 line-clamp-2">
                                        {project.projectDescription}
                                    </p>
                                </motion.button>
                            ))}
                        </motion.div>

                        <div className="lg:col-span-8">
                            <AnimatePresence mode="wait">
                                {selectedProject && (
                                    <motion.div
                                        key={selectedProject._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                                        className="space-y-8"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <h2 className="font-heading text-4xl font-bold">
                                                    {selectedProject.projectName}
                                                </h2>
                                                <div className="flex gap-3">
                                                    {/* Casting to any to access extra props from mock data/original interface */}
                                                    {(selectedProject as any).githubLink && (
                                                        <a
                                                            href={(selectedProject as any).githubLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-3 bg-foreground/5 border border-foreground/10 rounded-lg hover:border-accent transition-colors duration-300"
                                                            aria-label="View on GitHub"
                                                        >
                                                            <Github size={20} />
                                                        </a>
                                                    )}
                                                    {(selectedProject as any).liveLink && (
                                                        <a
                                                            href={(selectedProject as any).liveLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-3 bg-accent text-primary-foreground rounded-lg hover:bg-accent/90 transition-colors duration-300"
                                                            aria-label="View live project"
                                                        >
                                                            <ExternalLink size={20} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="font-paragraph text-lg text-foreground/80 leading-relaxed">
                                                {selectedProject.projectDescription}
                                            </p>
                                        </div>

                                        {(selectedProject as any).mainScreenshot && (
                                            <ProgressiveScreenshot
                                                src={(selectedProject as any).mainScreenshot}
                                                alt={`${selectedProject.projectName} screenshot`}
                                            />
                                        )}

                                        {(selectedProject as any).techStack && (
                                            <ExpandableSection
                                                title="Tech Stack"
                                                isExpanded={expandedSections['tech']}
                                                onToggle={() => toggleSection('tech')}
                                            >
                                                <div className="flex flex-wrap gap-3">
                                                    {(selectedProject as any).techStack.split(',').map((tech: string, index: number) => (
                                                        <span
                                                            key={index}
                                                            className="font-paragraph text-sm px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg"
                                                        >
                                                            {tech.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </ExpandableSection>
                                        )}

                                        {(selectedProject as any).architectureDetails && (
                                            <ExpandableSection
                                                title="Architecture"
                                                isExpanded={expandedSections['arch']}
                                                onToggle={() => toggleSection('arch')}
                                            >
                                                <p className="font-paragraph text-base text-foreground/80 leading-relaxed whitespace-pre-line">
                                                    {(selectedProject as any).architectureDetails}
                                                </p>
                                            </ExpandableSection>
                                        )}

                                        {(selectedProject as any).designDecisions && (
                                            <ExpandableSection
                                                title="Design Decisions"
                                                isExpanded={expandedSections['design']}
                                                onToggle={() => toggleSection('design')}
                                            >
                                                <p className="font-paragraph text-base text-foreground/80 leading-relaxed whitespace-pre-line">
                                                    {(selectedProject as any).designDecisions}
                                                </p>
                                            </ExpandableSection>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="py-12 px-8 border-t border-foreground/10">
                <div className="max-w-[120rem] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="font-paragraph text-sm text-foreground/60">
                        © 2026. Built with precision.
                    </p>
                </div>
            </footer>
        </div>
    );
}

function ProgressiveScreenshot({ src, alt }: { src: string; alt: string }) {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <motion.div
            className="relative overflow-hidden rounded-lg border border-foreground/10 bg-foreground/5 cursor-pointer group"
            onClick={() => setIsRevealed(!isRevealed)}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <div className="aspect-video relative">
                <Image
                    src={src}
                    alt={alt}
                    width={1200}
                    height={675}
                    className="w-full h-full object-cover"
                />

                <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: isRevealed ? 0 : 0.6 }}
                    className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-transparent pointer-events-none"
                />

                {!isRevealed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm"
                    >
                        <p className="font-paragraph text-base text-foreground">
                            Click to reveal full screenshot
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

function ExpandableSection({
    title,
    isExpanded,
    onToggle,
    children
}: {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="border border-foreground/10 rounded-lg overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-6 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors duration-300"
            >
                <h3 className="font-heading text-2xl font-semibold">{title}</h3>
                {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
