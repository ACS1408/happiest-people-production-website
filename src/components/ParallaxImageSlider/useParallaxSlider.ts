import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const SCREEN_BREAKPOINT = 1200;

const useParallaxSlider = () => {
  const main = useRef(null);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  // Memoize the checkScreenSize function
  const checkScreenSize = useCallback(() => {
    setIsLargeScreen(window.innerWidth >= SCREEN_BREAKPOINT);
  }, []);

  // Memoize the debounced resize handler
  const debouncedResize = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    const handler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 100);
    };
    return {
      handler,
      cleanup: () => clearTimeout(timeoutId),
    };
  }, [checkScreenSize]);

  // Setup resize listener
  useEffect(() => {
    const { handler, cleanup } = debouncedResize();
    checkScreenSize(); // Initial check
    window.addEventListener("resize", handler);
    return () => {
      cleanup();
      window.removeEventListener("resize", handler);
    };
  }, [checkScreenSize, debouncedResize]);

  useGSAP(() => {
    const ctx = gsap.context((self) => {
      const selector = (self as gsap.Context).selector;
      if (!selector) return;

      const parallax_image_slider_wrapper = selector(
        `.parallax-image-slider__wrapper`
      );
      const parallax_image_slider_slide = selector(
        `.parallax-image-slider__slide`
      );
      const parallax_image_slider_image = selector(
        `.parallax-image-slider__image img`
      );

      // Compute dynamic end distance for ScrollTrigger (re-evaluated on refresh)
      const getScrollEnd = () => {
        // Calculate the actual scroll distance needed by summing all slide widths
        const slides = parallax_image_slider_slide as any;
        const slidesLen = slides?.length || 0;
        const wrapperElement = (parallax_image_slider_wrapper as any)?.[0];
        const gap = wrapperElement
          ? parseInt(window.getComputedStyle(wrapperElement).gap) || 0
          : 0;
        
        // Sum all individual slide widths
        const totalContentWidth = Array.from(slides).reduce((sum: number, slide: any) => sum + (slide.clientWidth || 0), 0) + gap * (slidesLen - 1);
        
        // Get the viewport width (outer wrapper width)
        const viewportWidth = wrapperElement?.clientWidth || window.innerWidth;
        
        // Scroll only until the last slide's right edge aligns with viewport's right edge
        const scrollDistance = Math.max(0, totalContentWidth - viewportWidth);
        console.log(scrollDistance, "scrollDistance", totalContentWidth, "totalContentWidth", viewportWidth, "viewportWidth");
        return scrollDistance;
      };

      ScrollTrigger.matchMedia({
        "(min-width: 1200px)": function () {
          gsap.set(parallax_image_slider_wrapper, { x: 0, force3d: true });
          gsap.set(parallax_image_slider_image, {
            scale: 1.2,
            xPercent: 10,
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: main.current,
              start: "center center+=38",
              end: `+=${getScrollEnd()}px`, // dynamic end; recalculated on refresh
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.to(parallax_image_slider_wrapper, {
            x: -getScrollEnd(),
          });
          tl.to(
            parallax_image_slider_image,
            {
              xPercent: -10,
            },
            "<"
          );
        },
      });
    }, main);
    return () => ctx.revert();
  }, []);

  // Observe layout height changes (e.g., banner reveal) and refresh ScrollTrigger to fix pin position
  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId: number | null = null;
    const debouncedRefresh = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    const observer = new ResizeObserver(debouncedRefresh);
    try {
      // Observe both the body and the slider's nearest container for robust updates
      observer.observe(document.body);
      const parentEl = (main.current as unknown as Element | null)
        ?.parentElement;
      if (parentEl) observer.observe(parentEl);
    } catch (e) {
      // no-op if observation fails
      console.log(e);
    }

    // Also run a refresh once after mount to catch any async content/layout shifts
    const timeoutId = window.setTimeout(() => ScrollTrigger.refresh(), 0);

    return () => {
      window.clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return {
    main,
    isLargeScreen,
  };
};

export default useParallaxSlider;
