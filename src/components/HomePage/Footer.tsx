"use client";

import React from 'react';

export default function Footer() {
    return (
        <footer className="py-4 md:py-6 border-t border-foreground/5 bg-background">
            <div className="max-w-[120rem] mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
                <div className="text-center md:text-left">
                    <p className="font-heading font-bold text-sm mb-1">Nikhil Garg</p>
                    <p className="text-xs md:text-sm text-foreground/40">© 2026. Built with precision.</p>
                </div>

                <div className="flex gap-6 md:gap-8">
                    <a href="https://github.com/Nikhilgarg0" target="_blank" rel="noopener noreferrer" className="text-foreground/40 hover:text-accent transition-colors text-xs md:text-sm">GitHub</a>
                    <a href="https://www.linkedin.com/in/Nikhil-garg8982" target="_blank" rel="noopener noreferrer" className="text-foreground/40 hover:text-accent transition-colors text-xs md:text-sm">LinkedIn</a>
                    <a href="mailto:official.nikhilgarg@gmail.com" className="text-foreground/40 hover:text-accent transition-colors text-xs md:text-sm">Email</a>
                </div>
            </div>
        </footer>
    );
}
