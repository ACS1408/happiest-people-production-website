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
        const firstSlideWidth =
          (parallax_image_slider_slide as any)?.[0]?.clientWidth || 0;
        const slidesLen = (parallax_image_slider_slide as any)?.length || 0;
        const total = (firstSlideWidth * slidesLen) / 2;
        return `+=${total}px`;
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
              end: getScrollEnd, // dynamic end; recalculated on refresh
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.to(parallax_image_slider_wrapper, {
            x: `-100%`,
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
      console.log(e)
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
