"use client";
import React, { useRef } from "react";
import Container from "@/components/Container";
import CircularText from "@/components/CircularText";
import TestimonialSlider from "@/components/TestimonialSlider";
import { twc } from "@/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HomeTestimonials = () => {
  const circularRef = useRef<SVGSVGElement | null>(null);
  const rotationTween = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    if (!circularRef.current) return;

    // Infinite rotation tween
    rotationTween.current = gsap.to(circularRef.current, {
      rotation: 360,
      duration: 8,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });

    // Detect scroll direction and reverse spin
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        rotationTween.current?.timeScale(self.direction === 1 ? 1 : -1);
      },
    });
  }, []);

  return (
    <section
      data-widget="home-testimonials"
      className={`home-testimonials ${twClasses.section}`}
    >
      <Container>
        <div className="grid grid-cols-3">
          <div className="origin-center size-max will-change-transform">
            <CircularText
              textArray={["Trusted By Clients", "Testimonial"]}
              diameter={200}
              letterSpacing={10}
              startAngle={40}
              circularRef={circularRef}
            />
          </div>

          <div className="col-span-2">
            <TestimonialSlider />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HomeTestimonials;

const twClasses = twc({
  section: "bg-black py-32",
});
