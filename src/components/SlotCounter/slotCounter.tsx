"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SlotCounterProps {
  target: string; // e.g. "3000+", "200k"
  duration?: number; // seconds
}

const SlotCounter = ({ target, duration = 2 }: SlotCounterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState("0");

  // Split numeric part and suffix
  const match = target.match(/^(\d+)(.*)$/);
  const numericPart = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: numericPart,
          duration,
          ease: "power3.out", // smoother ease
          roundProps: "val", // ensure whole numbers
          onUpdate: () => {
            setCount(obj.val.toLocaleString()); // adds commas smoothly
          },
        });
      },
    });
  }, [numericPart, duration]);

  return (
    <div ref={containerRef}>
      {count}
      {suffix}
    </div>
  );
};

export default SlotCounter;
