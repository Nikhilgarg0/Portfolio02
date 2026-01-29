import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // ... same colors and sizes ...
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.25', letterSpacing: '0.025em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.75', letterSpacing: '-0.025em', fontWeight: '400' }],
                xl: ['1.25rem', { lineHeight: '1.75', letterSpacing: '-0.025em', fontWeight: '500' }],
                '2xl': ['1.5rem', { lineHeight: '2', letterSpacing: '-0.05em', fontWeight: '500' }],
                '3xl': ['1.875rem', { lineHeight: '2.25', letterSpacing: '-0.05em', fontWeight: '600' }],
                '4xl': ['2.25rem', { lineHeight: '2.5', letterSpacing: '-0.05em', fontWeight: '600' }],
                '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '700' }],
                '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '700' }],
                '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '800' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '800' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '900' }]
            },
            fontFamily: {
                heading: ['var(--font-space-grotesk)', 'sans-serif'],
                paragraph: ['var(--font-roboto)', 'sans-serif']
            },
            colors: {
                accent: '#007BFF',
                destructive: '#dc3545',
                'destructive-foreground': '#FFFFFF',
                background: '#121212',
                secondary: '#6c757d',
                foreground: '#E0E0E0',
                'secondary-foreground': '#FFFFFF',
                'primary-foreground': '#FFFFFF',
                primary: '#007BFF'
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'cursor-blink': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' }
                }
            },
            animation: {
                'cursor-blink': 'cursor-blink 1s step-end infinite'
            }
        }
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/typography"),
        require("@tailwindcss/container-queries"),
    ],
};
export default config;
