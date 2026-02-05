"use client";

import { useEffect, useRef } from "react";

export function MouseGlow() {
    const blobRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!blobRef.current) return;

            const { clientX, clientY } = e;

            blobRef.current.animate({
                left: `${clientX}px`,
                top: `${clientY}px`
            }, { duration: 3000, fill: "forwards" });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
            <div
                ref={blobRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[100px] opacity-20"
            />
        </div>
    );
}
