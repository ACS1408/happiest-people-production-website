import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MarqueeSliderProps {
  className?: string;
  children: React.ReactNode;
  speed?: number;
}

const MarqueeSlider = ({
  className = "",
  children,
  speed = 20,
}: MarqueeSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const initMarquee = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const content = container.querySelector(".marquee-content");
      if (!content) return;

      // Kill existing animation if any
      if (timeline.current) {
        timeline.current.kill();
      }

      // Check if content overflows
      const { scrollWidth: contentWidth, clientWidth: containerWidth } =
        content;
      const shouldMove = contentWidth > containerWidth;
      setShouldAnimate(shouldMove);

      if (shouldMove) {
        // Create GSAP timeline for smooth infinite scrolling
        timeline.current = gsap
          .timeline({ repeat: -1 })
          .to(content, {
            x: () => -contentWidth,
            duration: speed,
            ease: "none",
          })
          .set(content, { x: 0 });
      } else {
        // Reset position if no animation needed
        gsap.set(content, { x: 0 });
      }
    };

    // Initialize marquee
    initMarquee();

    // Add resize listener
    const resizeObserver = new ResizeObserver(initMarquee);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      if (timeline.current) {
        timeline.current.kill();
      }
      resizeObserver.disconnect();
    };
  }, [children, speed]);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div
        className={`marquee-content ${className}`}
        style={{ display: "flex", gap: "16px" }}
      >
        {children}
        {shouldAnimate && children}
      </div>
    </div>
  );
};

export default MarqueeSlider;
