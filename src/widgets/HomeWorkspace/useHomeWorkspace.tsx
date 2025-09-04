import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const useHomeWorkspace = () => {
  const containerRef = useRef<HTMLElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!descriptionRef.current) return;

    // Split text into chars
    const split = new SplitText(descriptionRef.current, {
      type: "words,chars",
      charsClass: "char inline-block",
      wordsClass: "word inline-block whitespace-nowrap mr-[0.1em]",
    });

    gsap.set(split.chars, { opacity: 0.2 });

    gsap.to(split.chars, {
      opacity: 1,
      ease: "power3.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "top top",
        scrub: true,
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      split.revert(); // cleanup on unmount
    };
  }, []);

  return { containerRef, descriptionRef };
};

export default useHomeWorkspace;
