"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SlotCounterProps {
  target: string; // e.g. "3000+", "200k"
  duration?: number; // seconds for each column baseline
}

// Simple styles kept inline to avoid new CSS files
const styles = {
  wrapper: {
    display: "inline-flex",
    alignItems: "center" as const,
    gap: "0.1em",
    lineHeight: 1,
    position: "relative" as const,
  },
  digitsRow: {
    display: "inline-flex",
    gap: "0.05em",
    // Ensure consistent digit width to avoid horizontal jitter
    fontVariantNumeric: "tabular-nums" as const,
  },
  columnViewport: {
    position: "relative" as const,
    overflow: "hidden" as const,
    display: "inline-block",
    height: "1em",
    width: "1ch", // make each column as wide as one digit
    textAlign: "center" as const,
    // Fade top & bottom to avoid harsh crop
    WebkitMaskImage:
      "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0))",
    maskImage:
      "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0))",
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
  },
  columnInner: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    willChange: "transform" as const,
  },
  digit: {
    display: "block", // stack vertically
    height: "1em",
    lineHeight: "1em",
  },
  suffix: {
    marginLeft: "0.1em",
  },
};

const SlotCounter = ({ target, duration = 2 }: SlotCounterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<HTMLDivElement[]>([]);
  const digitHeightRef = useRef<number>(0);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const [measured, setMeasured] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Parse numeric part and suffix
  const match = useMemo(() => target.match(/^(\d+)(.*)$/), [target]);
  const digits = useMemo(() => (match ? match[1].split("") : ["0"]), [match]);
  const suffix = useMemo(() => (match ? match[2] : ""), [match]);

  // Keep refs array in sync with digits length
  useEffect(() => {
    columnRefs.current = columnRefs.current.slice(0, digits.length);
  }, [digits.length]);

  // Measure a single digit height to compute translate distances
  useLayoutEffect(() => {
    const measure = () => {
      const el = measureRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const h = Math.round(rect.height);
        if (h && h !== digitHeightRef.current) {
          digitHeightRef.current = h;
          setMeasured(true);
        }
      }
    };
    measure();

    // Observe size changes (font load, responsive resize)
    let ro: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => measure());
      ro.observe(containerRef.current);
    }
    return () => {
      ro?.disconnect();
    };
  }, [digits.length]);

  useEffect(() => {
    if (!measured) return;

    const cycles = 2; // how many full 0-9 loops before landing
    const baseDelay = 0.05; // slight delay before first column
    const stagger = 0.1; // delay added per column

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        setHasPlayed(true);
        // Re-measure digit height right before animation in case fonts finished loading
        const sample = containerRef.current?.querySelector(
          '[data-digit-item="true"]'
        ) as HTMLElement | null;
        if (sample) {
          const rect = sample.getBoundingClientRect();
          const css = window.getComputedStyle(sample);
          const lineH = parseFloat(css.lineHeight);
          digitHeightRef.current =
            rect.height ||
            lineH ||
            sample.offsetHeight ||
            digitHeightRef.current ||
            16;
        }

        const ctx = gsap.context(() => {
          columnRefs.current.forEach((col, idx) => {
            if (!col) return;
            const targetDigit = parseInt(digits[idx] || "0", 10);
            const totalSteps = cycles * 10 + targetDigit; // last item index to land on
            const itemsCount = col.querySelectorAll(
              '[data-digit-item="true"]'
            ).length;
            const finalIndex = Math.min(totalSteps, itemsCount - 1);
            const y = -finalIndex * digitHeightRef.current;

            gsap.fromTo(
              col,
              { y: 0 },
              {
                y,
                duration: duration + idx * 0.2,
                ease: "power2.inOut",
                delay: baseDelay + idx * stagger,
                // Snap to pixel to avoid blurry/half lines and ensure exact landing
                roundProps: "y",
                force3D: true,
              }
            );
          });
        }, containerRef);
        console.log("ctx", ctx);
        // Note: We intentionally do not revert here so the final numbers remain visible.
      },
    });

    return () => {
      trigger.kill();
    };
  }, [measured, digits, duration]);

  const setColRef = (idx: number) => (el: HTMLDivElement | null) => {
    if (el) columnRefs.current[idx] = el;
  };

  // Build repeated 0-9 stacks ending with the target digit for each column
  const renderColumn = (digit: string, idx: number) => {
    const cycles = 2; // must match cycles used in animation
    const targetNumber = parseInt(digit, 10);
    const items: number[] = [];
    for (let c = 0; c < cycles; c++) {
      for (let n = 0; n < 10; n++) items.push(n);
    }
    // Add the partial final cycle up to the target digit so the list is long enough
    for (let n = 0; n <= targetNumber; n++) items.push(n);

    return (
      <span
        key={idx}
        style={{
          ...styles.columnViewport,
          height: digitHeightRef.current
            ? `${digitHeightRef.current}px`
            : undefined,
        }}
        aria-hidden="true"
      >
        <span ref={setColRef(idx)} style={styles.columnInner}>
          {items.map((n, i) => (
            <span
              key={i}
              style={{
                ...styles.digit,
                height: digitHeightRef.current
                  ? `${digitHeightRef.current}px`
                  : undefined,
                lineHeight: digitHeightRef.current
                  ? `${digitHeightRef.current}px`
                  : undefined,
              }}
              data-digit-item="true"
            >
              {n}
            </span>
          ))}
        </span>
      </span>
    );
  };

  return (
    <div ref={containerRef} style={styles.wrapper}>
      {/* Initial zero overlay to avoid blank state before animation */}
      {!hasPlayed && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            display: "inline-flex",
            gap: (styles.digitsRow as any).gap || "0.05em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {digits.map((_, i) => (
            <span
              key={`z-${i}`}
              style={{
                width: "1ch",
                textAlign: "center",
              }}
            >
              0
            </span>
          ))}
        </span>
      )}
      {/* Hidden measurement row to determine exact digit height */}
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          visibility: "hidden",
          height: "auto",
          lineHeight: "normal",
          whiteSpace: "nowrap",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        0
      </span>
      <span style={styles.digitsRow} aria-label={match ? match[1] : "0"}>
        {digits.map((d, i) => renderColumn(d, i))}
      </span>
      {suffix ? (
        <span style={styles.suffix} aria-hidden="true">
          {suffix}
        </span>
      ) : null}
    </div>
  );
};

export default SlotCounter;
