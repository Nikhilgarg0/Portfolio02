"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { AnimatedElement } from '@/components/shared/AnimatedElement';
import { EASE_OUT } from '@/lib/constants';
import emailjs from '@emailjs/browser';

// --- Contact Section ---
export default function ContactSection() {
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [activeField, setActiveField] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [customSubject, setCustomSubject] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('submitting');
        setErrorMessage('');

        try {
            if (!formRef.current) {
                throw new Error('Form reference not found');
            }

            // EmailJS configuration from environment variables
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

            if (!serviceId || !templateId || !publicKey) {
                throw new Error('EmailJS configuration is missing');
            }

            // Send email using EmailJS
            const result = await emailjs.sendForm(
                serviceId,
                templateId,
                formRef.current,
                publicKey
            );

            console.log('Email sent successfully:', result.text);
            setFormState('success');

            // Reset form after successful submission
            if (formRef.current) {
                formRef.current.reset();
                setSelectedSubject('');
                setCustomSubject('');
                const charCounter = document.getElementById('char-counter');
                if (charCounter) charCounter.textContent = '0/1000';
            }
        } catch (error) {
            console.error('Email sending failed:', error);
            setFormState('error');
            setErrorMessage('Failed to send message. Please try again or email me directly.');

            // Reset to idle after showing error
            setTimeout(() => {
                setFormState('idle');
                setErrorMessage('');
            }, 5000);
        }
    };

    const subjects = ['Hiring', 'Collaboration', 'Feedback', 'Other'];

    return (
        <section id="contact" className="py-10 md:py-12 lg:py-16 px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
            <AnimatedElement>
                <div className="mb-6 md:mb-8 lg:mb-10">
                    <span className="text-accent font-mono text-xs sm:text-sm uppercase tracking-wider">Contact</span>
                    <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold mt-2 md:mt-3 mb-2 md:mb-3 lg:mb-4">Get in touch</h2>
                    <p className="text-foreground/60 text-xs sm:text-sm md:text-base">
                        Have a question or want to work together? Send me a message.
                    </p>
                </div>

                {formState === 'success' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-accent/10 to-background/20 backdrop-blur-2xl border border-accent/20 rounded-[32px] p-10 md:p-16 text-center shadow-2xl"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/30">
                            <Mail className="text-white" size={36} />
                        </div>
                        <h3 className="font-heading text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Message Sent Successfully!</h3>
                        <p className="text-foreground/70 text-base md:text-lg mb-8">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                        <button
                            onClick={() => setFormState('idle')}
                            className="text-sm text-accent hover:text-accent/80 font-medium hover:underline transition-colors"
                        >
                            ← Send another message
                        </button>
                    </motion.div>
                ) : (
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 md:space-y-8 bg-gradient-to-br from-background/30 to-background/10 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                        {/* Error Message */}
                        {formState === 'error' && errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-500 text-sm text-center"
                            >
                                {errorMessage}
                            </motion.div>
                        )}

                        {/* Decorative gradients */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />

                        {/* Name & Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 relative z-10">
                            <div className="group">
                                <label className="block text-xs font-semibold text-foreground/60 mb-2 uppercase tracking-wider">
                                    Your Name
                                </label>
                                <input
                                    name="from_name"
                                    id="name"
                                    type="text"
                                    required
                                    onFocus={() => setActiveField('name')}
                                    onBlur={() => setActiveField(null)}
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-accent focus:bg-white/10 transition-all duration-300 text-base placeholder:text-foreground/30 group-hover:border-white/20"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-semibold text-foreground/60 mb-2 uppercase tracking-wider">
                                    Your Email
                                </label>
                                <input
                                    name="from_email"
                                    id="email"
                                    type="email"
                                    required
                                    onFocus={() => setActiveField('email')}
                                    onBlur={() => setActiveField(null)}
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-accent focus:bg-white/10 transition-all duration-300 text-base placeholder:text-foreground/30 group-hover:border-white/20"
                                />
                            </div>
                        </div>

                        {/* Subject Pills */}
                        <div className="relative z-10">
                            <label className="block text-xs font-semibold text-foreground/60 mb-3 uppercase tracking-wider">
                                What's this about?
                            </label>
                            {/* Hidden input to capture subject for EmailJS */}
                            <input type="hidden" name="subject" value={selectedSubject === 'Other' ? customSubject : selectedSubject} />
                            {/* Hidden input for recipient email */}
                            <input type="hidden" name="to_email" value="official.nikhilgarg@gmail.com" />
                            <div className="flex flex-wrap gap-2.5">
                                {subjects.map((subject) => (
                                    <motion.button
                                        key={subject}
                                        type="button"
                                        onClick={() => setSelectedSubject(subject)}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-5 py-2.5 rounded-full border-2 text-sm font-semibold backdrop-blur-sm transition-all duration-300 ${selectedSubject === subject
                                            ? 'border-accent bg-gradient-to-r from-accent/20 to-accent/10 text-accent shadow-lg shadow-accent/20'
                                            : 'border-white/10 bg-white/5 text-foreground/60 hover:border-white/20 hover:bg-white/10'
                                            }`}
                                    >
                                        {subject}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Custom Subject Input - Shows when 'Other' is selected */}
                            {selectedSubject === 'Other' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-3"
                                >
                                    <input
                                        type="text"
                                        value={customSubject}
                                        onChange={(e) => setCustomSubject(e.target.value)}
                                        placeholder="Please specify..."
                                        required={selectedSubject === 'Other'}
                                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-accent focus:bg-white/10 transition-all duration-300 text-base placeholder:text-foreground/30"
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* Message */}
                        <div className="relative z-10 group">
                            <label className="block text-xs font-semibold text-foreground/60 mb-2 uppercase tracking-wider">
                                Your Message
                            </label>
                            <textarea
                                name="message"
                                id="message"
                                required
                                rows={6}
                                maxLength={1000}
                                onFocus={() => setActiveField('message')}
                                onBlur={() => setActiveField(null)}
                                onChange={(e) => {
                                    const counter = document.getElementById('char-counter');
                                    if (counter) counter.textContent = `${e.target.value.length}/1000`;
                                }}
                                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-accent focus:bg-white/10 transition-all duration-300 resize-none text-base placeholder:text-foreground/30 group-hover:border-white/20"
                                placeholder="Tell me about your project, idea, or just say hello..."
                            />
                            <div id="char-counter" className="text-right text-xs text-foreground/40 mt-2 font-mono">0/1000</div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 relative z-10">
                            <p className="text-xs text-foreground/50 order-2 sm:order-1">
                                Or email me at <a href="mailto:official.nikhilgarg@gmail.com" className="text-accent hover:text-accent/80 font-semibold transition-colors">official.nikhilgarg@gmail.com</a>
                            </p>
                            <motion.button
                                type="submit"
                                disabled={formState === 'submitting'}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-3.5 bg-gradient-to-r from-accent to-accent/90 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2.5 text-base order-1 sm:order-2 w-full sm:w-auto justify-center"
                            >
                                <Mail size={20} />
                                {formState === 'submitting' ? 'Sending...' : 'Send Message'}
                            </motion.button>
                        </div>
                    </form>
                )}
            </AnimatedElement>
        </section>
    );
}
