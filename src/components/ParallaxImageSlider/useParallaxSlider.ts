import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const useParallaxSlider = () => {
  const main = useRef(null);
  useGSAP(() => {
    const ctx = gsap.context((self) => {
      const selector = (self as gsap.Context).selector;
      if (!selector) return;

      const parallax_image_slider_wrapper = selector(
        `.parallax-image-slider__wrapper`
      );
      const parallax_image_slider_outer = selector(
        `.parallax-image-slider__outer`
      );
      const parallax_image_slider_slide = selector(
        `.parallax-image-slider__slide`
      );
      const parallax_image_slider_image = selector(
        `.parallax-image-slider__image img`
      );

      const sliderWidth =
        parallax_image_slider_slide[0]?.clientWidth *
          parallax_image_slider_slide?.length +
        16 * parallax_image_slider_slide?.length -
        1;
      const containerWidth = parallax_image_slider_outer[0].closest(
        ".parallax-image-slider"
      ).clientWidth;
      console.log(sliderWidth, containerWidth);

      ScrollTrigger.matchMedia({
        "(min-width: 1200px)": function () {
          gsap.set(parallax_image_slider_wrapper, { x: 0, force3d: true });
          gsap.set(parallax_image_slider_image, {
            scale: 1.2,
            xPercent: 10,
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: main.current,
              start: "center center+=38",
              end: `+=${
                (parallax_image_slider_slide[0]?.clientWidth *
                  parallax_image_slider_slide?.length) /
                2
              }px`,
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
            },
          });
          tl.to(parallax_image_slider_wrapper, {
            x: `-100%`,
          });
          tl.to(
            parallax_image_slider_image,
            {
              xPercent: -10,
            },
            "<"
          );
        },
      });
    }, main);
    return () => ctx.revert();
  }, []);
  return {
    main,
  };
};

export default useParallaxSlider;
