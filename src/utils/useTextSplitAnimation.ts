"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface Options {
  stagger?: number;
  duration?: number;
  ease?: string;
  start?: string; // e.g. "top 80%"
  end?: string; // optional if you want a scroll-based end
  once?: boolean; // animate only once
}

const useTextSplitAnimation = (
  ref: React.RefObject<any>,
  options: Options = {}
) => {
  useEffect(() => {
    if (!ref.current) return;
    const split = new SplitText(ref.current, {
      type: "words,chars",
      charsClass: "split-char",
      wordsClass: "split-word",
    });

    gsap.set(split.chars, {
      willChange: "transform, opacity",
      backfaceVisibility: "hidden",
      force3D: true,
    });

    gsap.set(ref.current, { perspective: 600 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: options.start || "top 80%",
        end: options.end || "bottom 20%",
        toggleActions: options.once
          ? "play none none none"
          : "play none none reverse",
      },
    });

    tl.from(split.chars, {
      y: 40,
      rotationX: 90,
      opacity: 0,
      duration: options.duration || 1.2,
      ease: options.ease || "power3.out",
      stagger: options.stagger ?? 0.035,
      force3D: true,
    });

    return () => {
      tl.kill();
      split.revert();
    };
  }, [ref, options]);
};

export default useTextSplitAnimation;
