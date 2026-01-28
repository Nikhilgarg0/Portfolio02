"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Component to handle automatic scroll management
export function ScrollToTop() {
    const pathname = usePathname();
    const prevPathnameRef = useRef<string | null>(null);

    useEffect(() => {
        // Check if this is the same page
        const isSamePage = prevPathnameRef.current === pathname;

        // In Next.js App Router, hash handling is a bit different.
        // We can use window.location.hash to check for hash
        const hash = window.location.hash;

        // Check if the URL has a hash
        if (hash) {
            // URL with hash: Wait 100ms and then call scrollIntoView() to the target element
            setTimeout(() => {
                const element = document.getElementById(hash.slice(1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            // URL without hash: Scroll to the top of the page
            // Use smooth animation if same page, auto if different page
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: isSamePage ? 'smooth' : 'auto'
            });
        }

        // Update the previous location reference
        prevPathnameRef.current = pathname;
    }, [pathname]);

    return null;
}
