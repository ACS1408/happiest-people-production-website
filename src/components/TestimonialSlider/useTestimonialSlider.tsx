import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const useTestimonialSlider = () => {
  // Fade plugin
  const Fade = (slider: any) => {
    slider.on("created", () => {
      slider.slides.forEach((slide: HTMLElement, idx: number) => {
        slide.style.opacity = idx === slider.track.details.rel ? "1" : "0";
        slide.style.transition = "opacity 0.3s ease";
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
        gsap.registerPlugin(ScrollTrigger, SplitText);

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
    const textRef = useRef(null);

    useEffect(() => {
      if (!textRef.current) return;

      // Split by words first, then chars to maintain word integrity
      const split = new SplitText(textRef.current, {
        type: "words,chars",
        charsClass: "char inline-block",
        wordsClass: "word inline-block whitespace-nowrap mr-[0.1em]",
      });

      gsap.fromTo(
        split.chars,
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.01,
          ease: "power4.out",
          delay: 0.3,
        }
      );

      return () => {
        split.revert();
      };
    }, [triggerKey]);

    return (
      <p
        ref={textRef}
        className="xl:text-3xl text-2xl leading-tight mb-6 font-light"
      >
        {text}
      </p>
    );
  };

  return {
    Effects: { Fade, AutoHeight, Autoplay },
    Components: { WaveText },
  };
};

export default useTestimonialSlider;
