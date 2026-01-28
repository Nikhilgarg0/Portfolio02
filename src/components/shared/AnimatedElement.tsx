"use client";

import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import { EASE_OUT } from '@/lib/constants';

type AnimatedElementProps = {
    children: React.ReactNode;
    className?: string;
    delay?: number;
};

export const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, delay = 0 }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    return (
        <div
            ref={ref}
            className={`${className || ''}`}
            style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s cubic-bezier(${EASE_OUT.join(',')}), transform 0.6s cubic-bezier(${EASE_OUT.join(',')})`,
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    );
};
