"use client";
import React, { useState } from "react";
import Image from "next/image";
import useTestimonialSlider from "./useTestimonialSlider";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { twc } from "@/utils";

const TestimonialSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Destructure plugins from the custom hook
  const { Effects, Components } = useTestimonialSlider();
  const { Fade, AutoHeight, Autoplay } = Effects;
  const { WaveText } = Components;

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      renderMode: "custom",
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
        setAnimationTrigger((prev) => prev + 1);
      },
    },
    [Fade, AutoHeight, Autoplay(4000)] // autoplay every 4s
  );

  return (
    <div
      className={`testimonial-slider ${twClasses.slider}`}
      data-component="testimonial-slider"
    >
      <div ref={sliderRef} className={`keen-slider ${twClasses.slider_inner}`}>
        {testimonials.map((t, idx) => (
          <div key={idx} className="keen-slider__slide">
            <div className={`slide-inner ${twClasses.slide_inner}`}>
              <WaveText text={`“${t.quote}”`} triggerKey={animationTrigger} />
              <div className={`slide-footer ${twClasses.slide_footer}`}>
                <figure className={`slide-footer__avatar ${twClasses.avatar}`}>
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </figure>
                <div>
                  <p className={`slide-footer__name ${twClasses.name}`}>
                    {t.name}
                  </p>
                  <p className={`slide-footer__role ${twClasses.role}`}>
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className={`slider-pagination ${twClasses.pagination}`}>
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`slider-pagination__button ${
              twClasses.pagination_button
            } ${currentSlide === idx ? "bg-yellow-400" : "bg-gray-500"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;

const testimonials = [
  {
    quote: `Hubfolio studio ability to create a high quality UI stands out. It's something we placed a premium on. A studio with passionate, professional, fun and full creativity. Recommend!.`,
    name: "Bradley Gordon",
    role: "CEO & Founder, Archin Studio",
    avatar: "/images/avatar.webp",
  },
  {
    quote: `Working with Hubfolio has been an absolute pleasure. They bring innovation and dedication to every project.`,
    name: "Sophia Williams",
    role: "Creative Director, DesignWorks",
    avatar: "/images/avatar.webp",
  },
  {
    quote: `The quality and attention to detail they deliver is unmatched. They made our vision come alive.`,
    name: "James Carter",
    role: "Product Manager, TechHub",
    avatar: "/images/avatar.webp",
  },
];

const twClasses = twc({
  slider: "w-full max-w-4xl mx-auto relative",
  slider_inner: "relative transition-[height] duration-500 ease-in-out",
  slide_inner:
    "flex flex-col items-start justify-between gap-8 lg:px-6 lg:py-10 px-0 py-0 text-white bg-black rounded-2xl",
  slide_footer: "flex items-center gap-4",
  avatar: "size-10 relative rounded-full overflow-hidden",
  name: "font-medium",
  role: "text-sm text-gray-300",
  pagination:
    "flex justify-center mt-6 gap-4 xl:absolute xl:bottom-14 xl:right-8 rounded-2xl border border-grey-900 px-6 py-2 max-lg:w-max max-lg:me-auto max-lg:mt-10",
  pagination_button: "size-3 rounded-full transition-colors cursor-pointer",
});
