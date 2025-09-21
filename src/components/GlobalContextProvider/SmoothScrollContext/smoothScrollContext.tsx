"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

type SmoothScrollContextType = {
  lenis: any | null;
};

const SmoothScrollContextValue = createContext<SmoothScrollContextType>({
  lenis: null,
});

export const useSmoothScroll = () => useContext(SmoothScrollContextValue);

const SmoothScrollContext = ({ children }: { children: React.ReactNode }) => {
  const lenisRef = useRef<any>(null);

  // Drive Lenis with GSAP's ticker for perfect sync with ScrollTrigger
  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => gsap.ticker.remove(update);
  }, []);

  // Expose lenis globally and sync ScrollTrigger updates (wait until ref is ready)
  useEffect(() => {
    let cancelled = false;
    let detach: (() => void) | null = null;

    const tryAttach = () => {
      if (cancelled) return;
      const instance = lenisRef.current?.lenis;
      if (instance) {
        window.lenis = instance;
        const onScroll = () => ScrollTrigger.update();
        instance.on?.("scroll", onScroll);
        detach = () => instance.off?.("scroll", onScroll);
      } else {
        requestAnimationFrame(tryAttach);
      }
    };

    tryAttach();

    return () => {
      cancelled = true;
      detach?.();
      if (window.lenis) window.lenis = undefined;
    };
  }, []);

  const options = {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: "vertical", // vertical, horizontal
    gestureDirection: "vertical", // vertical, horizontal, both
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    autoRaf: false,
    smoothWheel: true,
  };

  return (
    <SmoothScrollContextValue.Provider
      value={{ lenis: lenisRef.current?.lenis }}
    >
      <ReactLenis root options={options} ref={lenisRef}>
        {children}
      </ReactLenis>
    </SmoothScrollContextValue.Provider>
  );
};

export default SmoothScrollContext;
