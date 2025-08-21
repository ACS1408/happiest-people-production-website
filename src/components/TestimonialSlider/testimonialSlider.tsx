"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "keen-slider/keen-slider.min.css";

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

// Fade plugin
const Fade = (slider: any) => {
  slider.on("created", () => {
    slider.slides.forEach((slide: HTMLElement, idx: number) => {
      slide.style.opacity = idx === slider.track.details.rel ? "1" : "0";
      slide.style.transition = "opacity 0.8s ease";
      slide.style.position = "absolute";
      slide.style.top = "0";
      slide.style.left = "0";
      slide.style.width = "100%";
    });
  });

  slider.on("slideChanged", (s: any) => {
    s.slides.forEach((slide: HTMLElement, idx: number) => {
      slide.style.opacity = idx === s.track.details.rel ? "1" : "0";
    });
  });
};

// Auto-height plugin
const AutoHeight = (slider: any) => {
  const setHeight = () => {
    const activeSlide = slider.slides[slider.track.details.rel];
    if (activeSlide) {
      const inner = activeSlide.querySelector(".slide-inner") as HTMLElement;
      if (inner) {
        slider.container.style.height = inner.scrollHeight + "px";
      }
    }
  };
  slider.on("created", setHeight);
  slider.on("slideChanged", setHeight);
  slider.on("updated", setHeight);
};

// Autoplay plugin
const Autoplay = (interval = 4000) => {
  return (slider: any) => {
    let timeout: ReturnType<typeof setTimeout>;
    let mouseOver = false;
    let scrollTriggerInstance: ScrollTrigger;

    function clearNextTimeout() {
      clearTimeout(timeout);
    }

    function nextTimeout() {
      clearTimeout(timeout);
      if (
        mouseOver ||
        (scrollTriggerInstance && !scrollTriggerInstance.isActive)
      )
        return;
      timeout = setTimeout(() => {
        slider.next();
      }, interval);
    }

    slider.on("created", () => {
      gsap.registerPlugin(ScrollTrigger);

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: slider.container,
        start: "top bottom-=100",
        end: "bottom top+=100",
        onEnter: () => nextTimeout(),
        onEnterBack: () => nextTimeout(),
        onLeave: () => clearNextTimeout(),
        onLeaveBack: () => clearNextTimeout(),
      });

      slider.container.addEventListener("mouseover", () => {
        mouseOver = true;
        clearNextTimeout();
      });

      slider.container.addEventListener("mouseout", () => {
        mouseOver = false;
        if (scrollTriggerInstance.isActive) {
          nextTimeout();
        }
      });
    });

    slider.on("destroyed", () => {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    });

    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  };
};

// Wave text animation
const WaveText = ({
  text,
  triggerKey,
}: {
  text: string;
  triggerKey: number;
}) => {
  return (
    <p className="text-3xl leading-tight mb-6 font-light">
      {text.split("").map((char, i) => (
        <span
          key={`${triggerKey}-${i}`}
          className="inline-block opacity-0 animate-wave"
          style={{
            animationDelay: `${i * 0.008}s`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </p>
  );
};

const TestimonialSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationTrigger, setAnimationTrigger] = useState(0);

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
    <div className="w-full max-w-4xl mx-auto relative">
      <div
        ref={sliderRef}
        className="keen-slider relative transition-[height] duration-500 ease-in-out"
      >
        {testimonials.map((t, idx) => (
          <div key={idx} className="keen-slider__slide">
            <div className="slide-inner flex flex-col items-start justify-between gap-8 px-6 py-10 text-white bg-black rounded-2xl">
              <WaveText text={`“${t.quote}”`} triggerKey={animationTrigger} />
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 relative rounded-full overflow-hidden">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4 absolute bottom-14 right-8 rounded-2xl border border-grey-900 px-6 py-2">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
              currentSlide === idx ? "bg-yellow-400" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
