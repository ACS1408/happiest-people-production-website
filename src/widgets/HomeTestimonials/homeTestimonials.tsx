"use client";
import React from "react";
import Container from "@/components/Container";
import CircularText from "@/components/CircularText";
import TestimonialSlider from "@/components/TestimonialSlider";
import { twc } from "@/utils";
import useHomeTestimonials from "./useHomeTestimonials";

const HomeTestimonials = () => {
  const { circularRef, iconRef } = useHomeTestimonials();

  return (
    <section
      data-widget="home-testimonials"
      className={`home-testimonials ${twClasses.section}`}
    >
      <Container>
        <div className={`home-testimonials__grid ${twClasses.grid}`}>
          <div
            className={`home-testimonials__circular-text ${twClasses.circularText}`}
          >
            <CircularText
              textArray={["Trusted By Clients", "Testimonial"]}
              diameter={200}
              letterSpacing={10}
              startAngle={40}
              circularRef={circularRef}
              iconRef={iconRef}
            />
          </div>

          <div className={`home-testimonials__slider ${twClasses.slider}`}>
            <TestimonialSlider />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HomeTestimonials;

const twClasses = twc({
  section: "bg-black xl:py-32 py-16",
  grid: "xl:grid xl:grid-cols-3",
  circularText: "origin-center size-max will-change-transform",
  slider: "col-span-2 max-lg:mt-8",
});
