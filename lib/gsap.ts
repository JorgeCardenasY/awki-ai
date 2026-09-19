"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar ScrollTrigger una sola vez (fuente de verdad compartida — skilyfi_state.md §5)
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
