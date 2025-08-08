"use client";
import React from "react";
import Container from "@/components/Container";
import CircularText from "@/components/CircularText";
import TestimonialSlider from "@/components/TestimonialSlider";
import { twc } from "@/utils";

const HomeTestimonials = () => {
  return (
    <section
      data-widget="home-testimonials"
      className={`home-testimonials ${twClasses.section}`}
    >
      <Container>
        <div className="grid grid-cols-3">
          <div className="">
            <CircularText
              textArray={["Trusted By Clients", "Testimonial"]}
              diameter={200}
              letterSpacing={10}
              startAngle={40}
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
