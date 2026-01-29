import type { Metadata } from "next";

import { Roboto, Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";

import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { MouseGlow } from "@/components/ui/mouse-glow";
import { GSAPRegistry } from "@/lib/gsap-registry";

const roboto = Roboto({
    weight: ['100', '300', '400', '500', '700', '900'],
    subsets: ['latin'],
    variable: '--font-roboto',
});

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
});

export const metadata: Metadata = {
    title: "Nikhil Garg | Full-Stack & Mobile Developer",
    description: "Portfolio of Nikhil Garg, a Full-Stack & Mobile Developer specializing in MERN, React Native, and Kotlin.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`dark ${roboto.variable} ${spaceGrotesk.variable} ${outfit.variable}`}>
            <body className="font-paragraph antialiased bg-background text-foreground selection:bg-accent/30 selection:text-accent">
                <GSAPRegistry />
                <SmoothScroll>
                    <MouseGlow />
                    {/* Global Grain Texture */}
                    <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
                    {children}
                </SmoothScroll>
            </body>
        </html>
    );
}
