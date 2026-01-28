import type { Metadata } from "next";
import { Roboto, Space_Grotesk } from 'next/font/google';
import "./globals.css";

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-roboto',
});
const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
    title: "Portfolio",
    description: "Portfolio Website",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${roboto.variable} ${spaceGrotesk.variable} antialiased min-h-screen bg-background text-foreground font-paragraph`}>
                {children}
            </body>
        </html>
    );
}
