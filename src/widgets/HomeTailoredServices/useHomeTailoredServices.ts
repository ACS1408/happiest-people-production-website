import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useHomeTailoredServices = () => {
  const asteriskRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Create the continuous rotation animation
      const rotationTween = gsap.to(asteriskRef.current, {
        rotation: "+=360",
        duration: 3,
        repeat: -1,
        ease: "none",
        paused: true,
      });

      // Create ScrollTrigger for direction control and play/pause
      ScrollTrigger.create({
        trigger: "[data-widget='home-tailored-service']",
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          // Check if element is in viewport
          if (self.isActive) {
            rotationTween.play();
            // Reverse the rotation direction based on scroll direction
            rotationTween.timeScale(self.direction > 0 ? 1 : -1);
          } else {
            // Pause the rotation when out of viewport
            rotationTween.pause();
          }
        },
      });
    },
    { scope: asteriskRef }
  );

  return { asteriskRef };
};

export default useHomeTailoredServices;
