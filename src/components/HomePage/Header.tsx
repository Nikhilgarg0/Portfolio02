"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function Header({ activeSection }: { activeSection: string }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = ['About', 'Experience', 'Projects', 'Contact'];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-8'
                }`}
        >
            <nav className="max-w-[120rem] mx-auto px-6 md:px-12 flex justify-between items-center">
                <Link href="/" className="font-heading text-xl font-bold tracking-tighter flex items-center gap-2 group">
                    <span className="w-8 h-8 bg-foreground text-background flex items-center justify-center rounded-sm font-mono text-sm group-hover:bg-accent transition-colors duration-300">
                        DEV
                    </span>
                    <span className="hidden sm:inline-block">Portfolio</span>
                </Link>

                <div className="flex items-center gap-8">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.toLowerCase();
                        return (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="font-paragraph text-sm text-foreground/70 hover:text-accent transition-colors duration-300 hidden md:block relative group"
                            >
                                {item}
                                <span
                                    className={`absolute bottom-0 left-0 h-px bg-accent transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                        }`}
                                />
                            </Link>
                        );
                    })}
                    <Link
                        href="/resume"
                        className="px-5 py-2 border border-foreground/20 rounded-full text-sm hover:border-accent hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                    >
                        CV
                        <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
                    </Link>
                </div>
            </nav>
        </header>
    );
}
