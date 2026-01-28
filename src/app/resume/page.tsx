"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/lib/data';
import { Experience } from '@/types';

export default function ResumePage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);

    useEffect(() => {
        const fetchExperiences = async () => {
            const { items } = await BaseCrudService.getAll<Experience>('experience');
            setExperiences(items.sort((a, b) => {
                const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                return dateB - dateA;
            }));
        };

        fetchExperiences();
    }, []);

    const formatDate = (date?: Date | string) => {
        if (!date) return 'Present';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
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
                        <Link href="/projects" className="font-paragraph text-sm hover:text-accent transition-colors duration-300">
                            Projects
                        </Link>
                    </div>
                </nav>
            </header>

            <div className="pt-32 pb-16 px-8">
                <div className="max-w-[100rem] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                        className="mb-16"
                    >
                        <h1 className="font-heading text-5xl font-bold mb-6">Resume</h1>
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <p className="font-paragraph text-lg text-foreground/70">
                                Full-Stack & Mobile Developer • Graduating 2026
                            </p>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 px-6 py-3 bg-accent text-primary-foreground font-paragraph text-base rounded-lg hover:bg-accent/90 transition-colors duration-300 w-fit"
                            >
                                <Download size={20} />
                                Download PDF
                            </button>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                            className="space-y-12"
                        >
                            <section>
                                <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Contact</h2>
                                <div className="space-y-4">
                                    <a
                                        href="mailto:official.nikhilgarg@gmail.com"
                                        className="flex items-center gap-3 font-paragraph text-base text-foreground/80 hover:text-accent transition-colors duration-300"
                                    >
                                        <Mail size={18} />
                                        official.nikhilgarg@gmail.com
                                    </a>
                                    <p className="flex items-center gap-3 font-paragraph text-base text-foreground/80 hover:text-accent transition-colors duration-300 cursor-default">
                                        <span>📱</span>
                                        +91 89825 58867
                                    </p>
                                    <a
                                        href="https://github.com/Nikhilgarg0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 font-paragraph text-base text-foreground/80 hover:text-accent transition-colors duration-300"
                                    >
                                        <Github size={18} />
                                        Nikhilgarg0
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/Nikhil-garg8982"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 font-paragraph text-base text-foreground/80 hover:text-accent transition-colors duration-300"
                                    >
                                        <Linkedin size={18} />
                                        Nikhil-garg8982
                                    </a>
                                    <a
                                        href="https://nikhilcodes.info"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 font-paragraph text-base text-foreground/80 hover:text-accent transition-colors duration-300"
                                    >
                                        <span>🌐</span>
                                        nikhilcodes.info
                                    </a>
                                </div>
                            </section>

                            <section>
                                <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Technical Skills</h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-heading text-lg font-semibold mb-3">Programming Languages</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {['C++', 'Java', 'Python', 'JavaScript'].map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="font-paragraph text-sm px-3 py-1 bg-foreground/5 border border-foreground/10 rounded"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-heading text-lg font-semibold mb-3">Web & Mobile</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {['MERN Stack', 'React Native', 'Expo', 'Android Studio', 'Kotlin'].map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="font-paragraph text-sm px-3 py-1 bg-foreground/5 border border-foreground/10 rounded"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-heading text-lg font-semibold mb-3">Tools & Cloud</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {['Git', 'GitHub', 'Firebase', 'Supabase', 'Google Cloud'].map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="font-paragraph text-sm px-3 py-1 bg-foreground/5 border border-foreground/10 rounded"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                            className="lg:col-span-2 space-y-12"
                        >
                            <section>
                                <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Professional Summary</h2>
                                <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                                    Full-stack and mobile developer with hands-on experience in MERN, React Native, and Kotlin. Skilled in building scalable applications, integrating AI features, and optimizing backend workflows. Passionate about user-centric product development, automation, and delivering reliable cloud-based solutions. Focused on creating impactful digital products with clean architecture and maintainable code.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Experience</h2>
                                <div className="space-y-8">
                                    {experiences.map((exp) => (
                                        <div key={exp._id} className="border-l-2 border-accent/30 pl-6 pb-6 relative">
                                            <div className="absolute left-[-9px] top-0 w-4 h-4 bg-accent rounded-full" />
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                                                <div>
                                                    <h3 className="font-heading text-xl font-semibold">{exp.title}</h3>
                                                    <p className="font-paragraph text-base text-accent">{exp.organizationName}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-paragraph text-sm text-foreground/60">
                                                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                                    </p>
                                                    {exp.location && (
                                                        <p className="font-paragraph text-sm text-foreground/60">{exp.location}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {exp.description && (
                                                <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Education</h2>
                                <div className="border-l-2 border-accent/30 pl-6 pb-6 relative space-y-8">
                                    <div className="relative">
                                        <div className="absolute left-[-33px] top-0 w-4 h-4 bg-accent rounded-full" />
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                                            <div>
                                                <h3 className="font-heading text-xl font-semibold">Bachelor of Technology in Computer Science</h3>
                                                <p className="font-paragraph text-base text-accent">Medicaps University, Indore, MP</p>
                                            </div>
                                            <p className="font-paragraph text-sm text-foreground/60">
                                                2022 – 2026
                                            </p>
                                        </div>
                                        <p className="font-paragraph text-base text-foreground/80">
                                            CGPA: 6.12
                                        </p>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-[-33px] top-0 w-4 h-4 bg-accent/50 rounded-full" />
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                                            <div>
                                                <h3 className="font-heading text-xl font-semibold">XII (MPBSE)</h3>
                                                <p className="font-paragraph text-base text-accent">Holy Angels Higher Secondary School, Kurawar, MP</p>
                                            </div>
                                            <p className="font-paragraph text-sm text-foreground/60">
                                                2022
                                            </p>
                                        </div>
                                        <p className="font-paragraph text-base text-foreground/80">
                                            Percentage: 71.2%
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Notable Projects</h2>
                                <p className="font-paragraph text-base text-foreground/80 mb-4">
                                    For detailed information on the health assistant app and other works, visit the{' '}
                                    <Link href="/projects" className="text-accent hover:text-accent/80 transition-colors duration-300">
                                        Projects page
                                    </Link>
                                    .
                                </p>
                                <div className="space-y-4">
                                    <div className="p-4 bg-foreground/[0.02] border border-foreground/10 rounded-lg">
                                        <h3 className="font-heading text-lg font-semibold mb-2">ASIZTO – AI Powered Health Assistant</h3>
                                        <p className="font-paragraph text-sm text-foreground/70 mb-2">
                                            Cross-platform mobile application with AI integration.
                                        </p>
                                        <p className="font-paragraph text-xs text-foreground/60 font-mono">
                                            React Native, Kotlin, Firebase, Google Gemini API
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </motion.div>
                    </div>
                </div>
            </div>

            <footer className="py-12 px-8 border-t border-foreground/10">
                <div className="max-w-[100rem] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="font-paragraph text-sm text-foreground/60">
                        © 2026 Nikhil Garg. All rights reserved.
                    </p>
                </div>
            </footer>

            <style jsx global>{`
        @media print {
          header, footer, button {
            display: none !important;
          }
          
          body {
            background: white !important;
            color: black !important;
          }
          
          .bg-background {
            background: white !important;
          }
          
          .text-foreground {
            color: black !important;
          }
          
          .border-foreground\\/10 {
            border-color: #ccc !important;
          }
          
          a {
            color: #007BFF !important;
          }
        }
      `}</style>
        </div>
    );
}
