"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { AnimatedElement } from '@/components/shared/AnimatedElement';
import { EASE_OUT } from '@/lib/constants';

// --- Contact Section ---
export default function ContactSection() {
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [activeField, setActiveField] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('submitting');
        setTimeout(() => setFormState('success'), 1500);
    };

    const subjects = ['Hiring', 'Collaboration', 'Feedback', 'Other'];

    return (
        <section id="contact" className="py-20 md:py-32 px-4 md:px-12 max-w-5xl mx-auto">
            <AnimatedElement>
                <div className="mb-12 md:mb-16">
                    <span className="text-accent font-mono text-xs md:text-sm uppercase tracking-wider">Contact</span>
                    <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 md:mt-4 mb-4 md:mb-6">Get in touch</h2>
                    <p className="text-foreground/60 text-base md:text-lg">
                        Have a question or want to work together? Send me a message.
                    </p>
                </div>

                {formState === 'success' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-accent/10 border border-accent/20 rounded-2xl p-8 md:p-12 text-center"
                    >
                        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="text-white" size={32} />
                        </div>
                        <h3 className="font-heading text-xl md:text-2xl font-bold mb-2">Message Sent</h3>
                        <p className="text-foreground/70 text-sm md:text-base">I'll get back to you as soon as possible.</p>
                        <button
                            onClick={() => setFormState('idle')}
                            className="mt-8 text-sm text-accent hover:underline"
                        >
                            Send another message
                        </button>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <div className="relative pt-6">
                                <motion.label
                                    animate={{
                                        y: activeField === 'name' || (document.getElementById('name') as HTMLInputElement)?.value ? -28 : 0,
                                        fontSize: activeField === 'name' || (document.getElementById('name') as HTMLInputElement)?.value ? '0.75rem' : '0.875rem',
                                        color: activeField === 'name' || (document.getElementById('name') as HTMLInputElement)?.value ? '#007BFF' : '#999999'
                                    }}
                                    transition={{ duration: 0.2, ease: EASE_OUT }}
                                    className="absolute left-4 block pointer-events-none"
                                >
                                    Name
                                </motion.label>
                                <input
                                    id="name"
                                    placeholder=""
                                    required
                                    onFocus={() => setActiveField('name')}
                                    onBlur={() => setActiveField(null)}
                                    className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors text-sm md:text-base"
                                />
                            </div>
                            <div className="relative pt-6">
                                <motion.label
                                    animate={{
                                        y: activeField === 'email' || (document.getElementById('email') as HTMLInputElement)?.value ? -28 : 0,
                                        fontSize: activeField === 'email' || (document.getElementById('email') as HTMLInputElement)?.value ? '0.75rem' : '0.875rem',
                                        color: activeField === 'email' || (document.getElementById('email') as HTMLInputElement)?.value ? '#007BFF' : '#999999'
                                    }}
                                    transition={{ duration: 0.2, ease: EASE_OUT }}
                                    className="absolute left-4 block pointer-events-none"
                                >
                                    Email
                                </motion.label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder=""
                                    required
                                    onFocus={() => setActiveField('email')}
                                    onBlur={() => setActiveField(null)}
                                    className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors text-sm md:text-base"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-3">Subject</label>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {subjects.map((subject) => (
                                    <motion.button
                                        key={subject}
                                        type="button"
                                        onClick={() => setSelectedSubject(subject)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        animate={{
                                            borderColor: selectedSubject === subject ? '#007BFF' : '#333333',
                                            backgroundColor: selectedSubject === subject ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                                            color: selectedSubject === subject ? '#007BFF' : '#999999'
                                        }}
                                        transition={{ duration: 0.2, ease: EASE_OUT }}
                                        className={`px-4 py-2 rounded-lg border text-xs md:text-sm font-medium`}
                                    >
                                        {subject}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="relative pt-6">
                            <motion.label
                                animate={{
                                    y: activeField === 'message' || (document.getElementById('message') as HTMLTextAreaElement)?.value ? -28 : 0,
                                    fontSize: activeField === 'message' || (document.getElementById('message') as HTMLTextAreaElement)?.value ? '0.75rem' : '0.875rem',
                                    color: activeField === 'message' || (document.getElementById('message') as HTMLTextAreaElement)?.value ? '#007BFF' : '#999999'
                                }}
                                transition={{ duration: 0.2, ease: EASE_OUT }}
                                className="absolute left-4 block pointer-events-none"
                            >
                                Message
                            </motion.label>
                            <textarea
                                id="message"
                                placeholder=""
                                required
                                rows={5}
                                onFocus={() => setActiveField('message')}
                                onBlur={() => setActiveField(null)}
                                className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-none text-sm md:text-base"
                            />
                            <div className="text-right text-xs text-foreground/40 mt-2">0/1000</div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={formState === 'submitting'}
                                className="px-6 md:px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base"
                            >
                                <Mail size={18} />
                                {formState === 'submitting' ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>

                        <p className="text-xs text-foreground/40 text-center pt-4">
                            Prefer email? Reach me at <a href="mailto:hello@example.com" className="text-accent hover:underline">hello@example.com</a>
                        </p>
                    </form>
                )}
            </AnimatedElement>
        </section>
    );
}
