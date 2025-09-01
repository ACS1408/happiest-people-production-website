import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { throttle } from "@/utils";

gsap.registerPlugin(ScrollTrigger);

const SCREEN_BREAKPOINT = 1200;
const CURSOR_ANIMATION_CONFIG = {
  duration: 0.3,
  enterEase: "power2.out",
  leaveEase: "power2.in",
  interpolationFactor: 0.08,
  throttleDelay: 16, // ~60fps
};

const useParallaxSlider = () => {
  const main = useRef(null);

  const [isLargeScreen, setIsLargeScreen] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth >= SCREEN_BREAKPOINT
      : true
  );
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorStateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    currentX: 0,
    currentY: 0,
  });

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

  // Memoize cursor animations
  const cursorAnimations = useMemo(
    () => ({
      enter: (cursor: HTMLElement) => {
        gsap.to(cursor, {
          scale: 1,
          duration: CURSOR_ANIMATION_CONFIG.duration,
          ease: CURSOR_ANIMATION_CONFIG.enterEase,
        });
      },
      leave: (cursor: HTMLElement) => {
        gsap.to(cursor, {
          scale: 0,
          duration: CURSOR_ANIMATION_CONFIG.duration,
          ease: CURSOR_ANIMATION_CONFIG.leaveEase,
        });
      },
    }),
    []
  );

  // Memoize mouse move handler with throttling
  const handleMouseMove = useCallback(
    (
      cursor: HTMLElement,
      slider: HTMLElement,
      cursorState: typeof cursorStateRef.current
    ) => {
      return throttle((e: MouseEvent) => {
        const rect = slider.getBoundingClientRect();
        cursorState.mouseX = e.clientX - rect.left;
        cursorState.mouseY = e.clientY - rect.top;
      }, CURSOR_ANIMATION_CONFIG.throttleDelay);
    },
    []
  );

  // Memoize ticker function
  const createTickerFunction = useCallback(
    (cursor: HTMLElement, cursorState: typeof cursorStateRef.current) => {
      let prevDeltaX = 0;
      let prevDeltaY = 0;

      return () => {
        const deltaX = cursorState.mouseX - cursorState.currentX;
        const deltaY = cursorState.mouseY - cursorState.currentY;

        // Skip update if change is minimal and no previous momentum
        if (
          Math.abs(deltaX) < 0.01 &&
          Math.abs(deltaY) < 0.01 &&
          Math.abs(prevDeltaX) < 0.01 &&
          Math.abs(prevDeltaY) < 0.01
        )
          return;

        cursorState.currentX +=
          deltaX * CURSOR_ANIMATION_CONFIG.interpolationFactor;
        cursorState.currentY +=
          deltaY * CURSOR_ANIMATION_CONFIG.interpolationFactor;

        prevDeltaX = deltaX;
        prevDeltaY = deltaY;

        gsap.set(cursor, {
          x: cursorState.currentX,
          y: cursorState.currentY,
        });
      };
    },
    []
  );

  useGSAP(() => {
    if (!cursorRef.current || !main.current || !isLargeScreen) return;

    const cursor = cursorRef.current;
    const slider = main.current as HTMLDivElement;
    const cursorState = cursorStateRef.current;

    // Initial cursor setup
    gsap.set(cursor, {
      scale: 0,
      xPercent: -50,
      yPercent: -50,
    });

    const throttledMouseMove = handleMouseMove(cursor, slider, cursorState);
    const tickerFunction = createTickerFunction(cursor, cursorState);

    // Event listeners with memoized handlers
    const handleEnter = () => cursorAnimations.enter(cursor);
    const handleLeave = () => cursorAnimations.leave(cursor);

    slider.addEventListener("mouseenter", handleEnter);
    slider.addEventListener("mouseleave", handleLeave);
    slider.addEventListener("mousemove", throttledMouseMove);

    // Add ticker
    const tickerId = gsap.ticker.add(tickerFunction);

    return () => {
      slider.removeEventListener("mouseenter", handleEnter);
      slider.removeEventListener("mouseleave", handleLeave);
      slider.removeEventListener("mousemove", throttledMouseMove);
      gsap.ticker.remove(tickerId);
    };
  }, [isLargeScreen, cursorAnimations, handleMouseMove, createTickerFunction]);

  useGSAP(() => {
    const ctx = gsap.context((self) => {
      const selector = (self as gsap.Context).selector;
      if (!selector) return;

      const parallax_image_slider_wrapper = selector(
        `.parallax-image-slider__wrapper`
      );
      const parallax_image_slider_outer = selector(
        `.parallax-image-slider__outer`
      );
      const parallax_image_slider_slide = selector(
        `.parallax-image-slider__slide`
      );
      const parallax_image_slider_image = selector(
        `.parallax-image-slider__image img`
      );

      const sliderWidth =
        parallax_image_slider_slide[0]?.clientWidth *
          parallax_image_slider_slide?.length +
        16 * parallax_image_slider_slide?.length -
        1;
      const containerWidth = parallax_image_slider_outer[0].closest(
        ".parallax-image-slider"
      ).clientWidth;
      console.log(sliderWidth, containerWidth);

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
              end: `+=${
                (parallax_image_slider_slide[0]?.clientWidth *
                  parallax_image_slider_slide?.length) /
                2
              }px`,
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
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

  return {
    main,
    isLargeScreen,
    cursorRef,
  };
};

export default useParallaxSlider;
