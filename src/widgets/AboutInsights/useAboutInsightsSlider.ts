import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { type InsightSlide } from "@/types/aboutInsights";

const useInsightsSlider = (slides: InsightSlide[]) => {
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef(false);

  const indexRef = useRef(0);

  const setSlideRef = (el: HTMLDivElement | null, i: number) => {
    slideRefs.current[i] = el;
  };

  // GSAP context setup
  useGSAP(
    () => {
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
          WebkitClipPath:
            i === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
          zIndex: i === 0 ? 2 : 1,
          scale: i === 0 ? 1 : 1.15,
          willChange: "clip-path, transform, opacity",
        });
      });
      indexRef.current = 0;
    },
    { scope: rootRef }
  );

  const goTo = (next: number) => {
    if (isAnimating.current || next === indexRef.current) return;
    isAnimating.current = true;

    const currentEl = slideRefs.current[indexRef.current];
    const nextEl = slideRefs.current[next];

    if (!currentEl || !nextEl) {
      isAnimating.current = false;
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        indexRef.current = next;
        isAnimating.current = false;
      },
    });

    // prepare next slide
    tl.set(nextEl, {
      zIndex: 3,
      clipPath: "inset(0% 0% 100% 0%)",
      WebkitClipPath: "inset(0% 0% 100% 0%)",
      scale: 1.15,
    });

    // reveal next image
    tl.to(
      nextEl,
      {
        clipPath: "inset(0% 0% 0% 0%)",
        WebkitClipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 1.2,
      },
      0
    );

    // content fade transition
    if (contentRef.current) {
      tl.to(contentRef.current, { opacity: 0, y: 20, duration: 0.35 }, 0);

      // switch text after fade-out
      tl.add(() => {
        setIndex(next);
      }, ">");

      // fade in new text right away
      tl.to(contentRef.current, { opacity: 1, y: 0, duration: 0.55 }, "<0.05");
    }

    // reset old slide
    tl.set(
      currentEl,
      {
        clipPath: "inset(0% 0% 100% 0%)",
        WebkitClipPath: "inset(0% 0% 100% 0%)",
        scale: 1.15,
        zIndex: 1,
      },
      ">"
    );
    tl.set(nextEl, { zIndex: 2 }, "<");
  };

  // autoplay loop
  useGSAP(() => {
    const id = setInterval(() => {
      const next = (indexRef.current + 1) % slides.length;
      goTo(next);
    }, 5000);

    return () => clearInterval(id);
  });

  return {
    rootRef,
    contentRef,
    index,
    setSlideRef,
    goTo, // also expose if you want manual navigation
  };
};

export default useInsightsSlider;
