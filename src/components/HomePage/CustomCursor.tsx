"use client";

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);
    const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[role="button"]') ||
                target.classList.contains('cursor-pointer');

            setIsHoveringInteractive(!!isInteractive);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [cursorX, cursorY]);

    return (
        <>
            <style jsx global>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
          input, textarea { cursor: text !important; }
        }
      `}</style>

            <motion.div
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                className="fixed w-8 h-8 border border-accent/40 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
            />

            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY,
                }}
                animate={{
                    scale: isHoveringInteractive ? 1.5 : 1,
                    backgroundColor: isHoveringInteractive ? '#007BFF' : 'rgba(0, 123, 255, 0.6)',
                }}
                transition={{ duration: 0.2 }}
                className="fixed w-2 h-2 bg-accent rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
            />
        </>
    );
}
