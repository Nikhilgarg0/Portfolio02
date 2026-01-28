"use client";

import React, { useEffect, useState } from 'react';
import { BaseCrudService } from '@/lib/data';
import { Experience, Projects } from '@/types';
import CustomCursor from '@/components/HomePage/CustomCursor';
import Header from '@/components/HomePage/Header';
import HeroSection from '@/components/HomePage/HeroSection';
import AboutSection from '@/components/HomePage/AboutSection';
import ExperienceSection from '@/components/HomePage/ExperienceSection';
import ProjectsSection from '@/components/HomePage/ProjectsSection';
import ContactSection from '@/components/HomePage/ContactSection';
import Footer from '@/components/HomePage/Footer';
import { ScrollToTop } from '@/lib/scroll-to-top';

export default function HomePage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [featuredProjects, setFeaturedProjects] = useState<Projects[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { items: expItems } = await BaseCrudService.getAll<Experience>('experience');
                const { items: projectItems } = await BaseCrudService.getAll<Projects>('projects');

                setExperiences(expItems.sort((a, b) => {
                    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                    return dateB - dateA;
                }));

                setFeaturedProjects(projectItems.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['about', 'experience', 'projects', 'contact'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 200 && rect.bottom >= 200) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground min-h-screen selection:bg-accent/30 selection:text-accent font-paragraph overflow-x-clip">
            <ScrollToTop />
            <CustomCursor />
            <Header activeSection={activeSection} />
            <HeroSection />
            <AboutSection />
            <ExperienceSection experiences={experiences} />
            <ProjectsSection projects={featuredProjects} />
            <ContactSection />
            <Footer />
        </div>
    );
}
