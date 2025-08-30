import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const useAboutBanner = () => {
  const mainRef = useRef<HTMLElement>(null);
  const buildingRef = useRef<SVGGElement>(null);
  const crowRef = useRef<SVGPathElement>(null);
  const cloud1Ref = useRef<SVGPathElement>(null);
  const cloud2Ref = useRef<SVGPathElement>(null);
  const treeRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      // Set initial states
      gsap.set(buildingRef.current, {
        autoAlpha: 0,
        y: 100,
      });

      gsap.set(treeRef.current, {
        yPercent: 100,
      });

      gsap.set(crowRef.current, {
        autoAlpha: 0,
        x: 100,
        y: 30,
        scale: 0.8,
      });

      gsap.set(cloud1Ref.current, {
        autoAlpha: 0,
        x: -100,
      });

      gsap.set(cloud2Ref.current, {
        autoAlpha: 0,
        x: 100,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top center-=100",
          end: "top top",
          toggleActions: "play none none reverse",
          scrub: true,
          anticipatePin: 1,
        },
      });

      // Animate building
      tl.to(buildingRef.current, {
        y: 0,
        opacity: 1,
        visibility: "visible",
        ease: "power3.out",
      })
        // Animate tree rising
        .to(
          treeRef.current,
          {
            yPercent: 0,
            ease: "power1.inOut",
          },
          "<+=0.2"
        )
        // Animate cloud 1 moving
        .to(
          cloud1Ref.current,
          {
            autoAlpha: 1,
            x: 0,
            ease: "power1.inOut",
          },
          "<+=0.2"
        )
        // Animate cloud 2 moving
        .to(
          cloud2Ref.current,
          {
            autoAlpha: 1,
            x: 0,
            ease: "power1.inOut",
          },
          "<"
        )
        // Animate crow flying
        .to(
          crowRef.current,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            ease: "power1.inOut",
          },
          "<+=0.1"
        );
    },
    { scope: mainRef }
  );

  return {
    mainRef,
    buildingRef,
    crowRef,
    cloud1Ref,
    cloud2Ref,
    treeRef,
  };
};

export default useAboutBanner;
