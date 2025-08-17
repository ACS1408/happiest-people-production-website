"use client";
import React from "react";
import Image from "next/image";
import type { ImageType } from "@/types/typeUtils";
import { twc } from "@/utils";
import useParallaxSlider from "./useParallaxSlider";

interface ParallaxImageSlider {
  images: ImageType[];
}

const ParallaxImageSlider: React.FC<ParallaxImageSlider> = ({
  images,
  ...props
}) => {
  const { main } = useParallaxSlider();
  return (
    <div
      data-component="parallax-image-slider"
      className={`parallax-image-slider ${twClasses.slider}`}
      ref={main}
      {...props}
    >
      <div className={`parallax-image-slider__outer ${twClasses.outer}`}>
        <div className={`parallax-image-slider__wrapper ${twClasses.wrapper}`}>
          {images &&
            images?.length !== 0 &&
            images?.map((image, i) => {
              return (
                <div
                  className={`parallax-image-slider__slide ${twClasses.slide} ${
                    twClasses.slide[`${image.ratio}`]
                  }`}
                  key={i}
                >
                  <figure
                    className={`parallax-image-slider__image ${twClasses.image}`}
                  >
                    <Image
                      src={image?.url}
                      fill
                      alt={image?.alt}
                      className="object-cover"
                    />
                  </figure>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ParallaxImageSlider;

const twClasses = twc({
  slider: "",
  outer: "overflow-auto no-scrollbar",
  wrapper: "flex gap-4",
  image: "relative h-[400px]",
  slide: {
    DEFAULT: "overflow-hidden",
    ratio_1: "flex-[0_0_50%] max-w-[50%]",
    ratio_2: "flex-[0_0_25%] max-w-[25%]",
    ratio_3: "flex-[0_0_30%] max-w-[30%]",
  },
});
