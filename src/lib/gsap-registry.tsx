"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Observer } from "gsap/Observer";

export function GSAPRegistry() {
    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);
    }, []);

    return null;
}
