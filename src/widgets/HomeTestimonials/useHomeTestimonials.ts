import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useHomeTestimonials = () => {
  const circularRef = useRef<SVGSVGElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const rotationTween = useRef<gsap.core.Tween | null>(null);
  const lastDir = useRef<0 | 1 | -1>(0); // 0 = unknown (first run)

  useGSAP(() => {
    if (!circularRef.current) return;

    rotationTween.current = gsap.to(circularRef.current, {
      rotation: 360,
      duration: 8,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const dir: 1 | -1 = self.direction === 1 ? 1 : -1;
        if (dir !== lastDir.current) {
          lastDir.current = dir;

          // change spin direction ONLY on direction change
          rotationTween.current?.timeScale(dir);

          // flip icon ONLY on direction change
          gsap.to(iconRef.current, {
            rotationY: dir === 1 ? 180 : 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      },
    });
  }, []);

  return {
    circularRef,
    iconRef,
  };
};

export default useHomeTestimonials;
