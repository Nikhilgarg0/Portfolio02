"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Workaround for Windows case-sensitive import issue
let Observer: any;
try {
    Observer = require("gsap/Observer").Observer || require("gsap/observer").Observer;
} catch {
    try {
        Observer = require("gsap/observer").Observer;
    } catch {}
}

export function GSAPRegistry() {
    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);
    }, []);

    return null;
}
