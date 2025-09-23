"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * CustomCursor
 * - Hidden on touch devices
 * - Follows mouse with easing
 * - Scales and reduces opacity when hovering interactive targets (a, button, [role=button])
 * - Fades out on mouseleave of document
 */
const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const isVisibleRef = useRef<boolean>(false);

  useGSAP(() => {
    // Guard SSR
    if (typeof window === "undefined") return;

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const cursor = cursorRef.current;

    if (isTouch || !cursor) {
      cursor ? (cursor.style.display = "none") : null;
      return;
    }

    // Center the element on the pointer, hint GPU compositing, and keep hidden initially
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      force3D: true,
      opacity: 0,
    });

    // Smooth trailing for x/y using quickTo (adds subtle delay)
    const xTo = gsap.quickTo(cursor, "x", {
      duration: 0.35,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(cursor, "y", {
      duration: 0.35,
      ease: "power3.out",
    });

    // Read primary color from CSS variable and prepare RGB form for comparisons
    const root = document.documentElement;
    const primaryHex = getComputedStyle(root)
      .getPropertyValue("--primary")
      .trim()
      .toLowerCase();
    const primaryRgb = hexToRgbString(primaryHex) ?? "rgb(251, 207, 29)"; // fallback for #fbcf1d

    const isTransparent = (val: string) => {
      const v = val.replace(/\s+/g, "").toLowerCase();
      return v === "transparent" || v === "rgba(0,0,0,0)";
    };

    const isOnPrimaryBackground = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      // Quick class-based check first
      if (el.closest("[data-invert-cursor=true]")) return true;
      // Traverse ancestors to find nearest solid background match
      let node: HTMLElement | null = el;
      let depth = 0;
      while (node && node !== document.documentElement && depth < 25) {
        const style = getComputedStyle(node);
        const bgColor = style.backgroundColor || "";
        if (!isTransparent(bgColor)) {
          return normalizeRgb(bgColor) === normalizeRgb(primaryRgb);
        }
        node = node.parentElement;
        depth++;
      }
      // Also consider body/html background
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      if (!isTransparent(bodyBg)) {
        return normalizeRgb(bodyBg) === normalizeRgb(primaryRgb);
      }
      const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
      if (!isTransparent(htmlBg)) {
        return normalizeRgb(htmlBg) === normalizeRgb(primaryRgb);
      }
      return false;
    };

    const asElement = (t?: EventTarget | null): Element | null => {
      if (!t) return null;
      // Prefer composedPath if available to get the innermost node
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyEvt = t as any;
      if (anyEvt?.composedPath && typeof anyEvt.composedPath === "function") {
        const path: unknown[] = anyEvt.composedPath();
        const elInPath = path.find((n) => n instanceof Element);
        if (elInPath && elInPath instanceof Element) return elInPath;
      }
      if (t instanceof Element) return t;
      // Handle Text nodes and others by walking to parentElement
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyT = t as any;
      if (
        anyT &&
        typeof anyT === "object" &&
        anyT.nodeType === Node.TEXT_NODE
      ) {
        return anyT.parentElement ?? null;
      }
      return null;
    };

    const updateAtPoint = (
      x: number,
      y: number,
      rawTarget?: EventTarget | null
    ) => {
      const targetEl: Element | null =
        asElement(rawTarget) || document.elementFromPoint(x, y);
      const isTargetLink = !!targetEl?.closest("a, button, [role=button]");
      const isInMainHeader = !!targetEl?.closest('[data-widget="main-header"]');
      const onPrimary = isOnPrimaryBackground(targetEl as HTMLElement | null);
      const dotEl = dotRef.current;
      const textEl = textRef.current;
      const cursor = cursorRef.current;
      if (!cursor) return;

      const textTarget = targetEl?.closest(
        "[data-cursor-text]"
      ) as Element | null;
      const hasCursorText = !!textTarget;
      const cursorText = textTarget?.getAttribute("data-cursor-text") ?? "";

      // Smooth position follow
      xTo(x);
      yTo(y);

      // Style/size/opacity reactions remain snappy
      gsap.to(cursor, {
        duration: 0.4,
        ease: "power4.out",
        opacity: isInMainHeader
          ? 0
          : hasCursorText
          ? 1
          : isTargetLink
          ? 0.6
          : 1,
        scale: isInMainHeader ? 0 : hasCursorText ? 1 : isTargetLink ? 2.5 : 1,
        width: hasCursorText ? 110 : 16,
        height: hasCursorText ? 110 : 16,
        force3D: true,
        autoRound: false,
        overwrite: "auto",
      });

      if (dotEl) {
        gsap.to(dotEl, {
          backgroundColor: onPrimary ? "#000000" : "var(--primary)",
          duration: 0.2,
          overwrite: "auto",
        });
      }

      if (textEl) {
        if (hasCursorText) {
          if (textEl.textContent !== cursorText) {
            textEl.textContent = cursorText;
          }
          gsap.to(textEl, {
            opacity: 1,
            color: onPrimary ? "#ffffff" : "#000000",
            duration: 0.2,
            overwrite: "auto",
          });
        } else {
          gsap.to(textEl, { opacity: 0, duration: 0.2, overwrite: "auto" });
        }
      }
    };

    const moveHandler = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      lastPosRef.current = { x, y };
      updateAtPoint(x, y, e.target);
    };

    const leaveHandler = () => {
      gsap.to(cursor, { duration: 1, opacity: 0, overwrite: "auto" });
      isVisibleRef.current = false;
    };

    // Show cursor on first movement (initially) and after any mouseleave
    const mousemoveHandler = (e: MouseEvent) => {
      if (!isVisibleRef.current) {
        // Set position immediately to avoid jump from top-left, then reveal via updateAtPoint
        isVisibleRef.current = true;
        const x = e.clientX;
        const y = e.clientY;
        lastPosRef.current = { x, y };
        gsap.set(cursor, { x, y });
        updateAtPoint(x, y, e.target);
        return;
      }
      moveHandler(e);
    };

    const scrollHandler = () => {
      const pos = lastPosRef.current;
      if (!pos) return;
      updateAtPoint(pos.x, pos.y);
    };

    const resizeHandler = scrollHandler;

    window.addEventListener("mousemove", mousemoveHandler);
    document.addEventListener("mouseleave", leaveHandler);
    window.addEventListener("scroll", scrollHandler, { passive: true });
    window.addEventListener("wheel", scrollHandler, { passive: true });
    window.addEventListener("touchmove", scrollHandler, { passive: true });
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("mousemove", mousemoveHandler);
      document.removeEventListener("mouseleave", leaveHandler);
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("wheel", scrollHandler);
      window.removeEventListener("touchmove", scrollHandler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  // Always render the node; it stays hidden on touch devices (no listeners attached)

  return (
    <div
      ref={cursorRef}
      className="custom-cursor fixed left-0 top-0 z-[2000] h-4 w-4 select-none pointer-events-none flex items-center justify-center"
      style={{
        willChange: "transform, opacity",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
      aria-hidden
    >
      {/* Primary dot; color may switch to black on primary background sections */}
      <span
        ref={dotRef}
        className="pointer-events-none absolute inset-0 rounded-full bg-primary"
      />
      {/* Dynamic text when hovering elements with data-cursor-text */}
      <span
        ref={textRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-lg font-normal leading-none tracking-wide select-none opacity-0"
      />
    </div>
  );
};

// Helpers
function hexToRgbString(hex: string): string | null {
  const h = hex.startsWith("#") ? hex.slice(1) : hex;
  if (h.length !== 3 && h.length !== 6) return null;
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return `rgb(${r}, ${g}, ${b})`;
}

function normalizeRgb(rgb: string): string {
  // Normalize spacing/case to compare strings reliably
  return rgb.replace(/\s+/g, "").toLowerCase();
}

export default CustomCursor;
