"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import useParallaxSlider from "./useParallaxSlider";
import { twc } from "@/utils";
import type { ImageType } from "@/types/utils";
import Container from "../Container";

interface ParallaxImageSlider {
  images: ImageType[];
}

const ParallaxImageSlider: React.FC<ParallaxImageSlider> = ({
  images,
  ...props
}) => {
  const { main, isLargeScreen, cursorRef } = useParallaxSlider();

  const ImageItem = ({ image }: { image: ImageType }) => {
    // Memoize the class name to prevent recalculation on each render
    const className = useMemo(
      () =>
        `parallax-image-slider__slide ${twClasses.slide} ${
          twClasses.slide[`${image.ratio}`]
        }`,
      [image.ratio]
    );

    return (
      <div className={className}>
        <figure className={`parallax-image-slider__image ${twClasses.image}`}>
          <Image
            src={image.url}
            fill
            alt={image.alt}
            className="object-cover"
            loading="eager"
            priority={true}
          />
        </figure>
      </div>
    );
  };

  // Set display name for React DevTools
  ImageItem.displayName = "ParallaxImageSliderItem";

  if (!isLargeScreen) {
    return (
      <Container>
        <div className="grid min-[376px]:grid-cols-2 gap-3">
          {images?.map((image, i) => (
            <ImageItem key={i} image={image} />
          ))}
        </div>
      </Container>
    );
  }

  return (
    <div
      data-component="parallax-image-slider"
      className={`parallax-image-slider relative ${twClasses.slider}`}
      ref={main}
      {...props}
    >
      {isLargeScreen && (
        <div ref={cursorRef} className={`scroll-cursor ${twClasses.cursor}`}>
          <span>Scroll</span>
        </div>
      )}
      <div className={`parallax-image-slider__outer ${twClasses.outer}`}>
        <div className={`parallax-image-slider__wrapper ${twClasses.wrapper}`}>
          {images?.map((image, i) => (
            <ImageItem key={i} image={image} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParallaxImageSlider;

const twClasses = twc({
  slider: "cursor-none",
  outer: "overflow-auto no-scrollbar",
  wrapper: "flex gap-4",
  image: "relative xl:h-[calc(100vh_-_200px)]",
  slide: {
    DEFAULT: "overflow-hidden",
    ratio_1: "flex-[0_0_50%] max-w-[50%]",
    ratio_2: "lg:flex-[0_0_25%] lg:max-w-[25%] flex-[0_0_50%] max-w-[50%]",
    ratio_3: "lg:flex-[0_0_30%] lg:max-w-[30%] flex-[0_0_50%] max-w-[50%]",
  },
  cursor:
    "absolute pointer-events-none z-50 w-24 h-24 rounded-full bg-primary flex items-center justify-center text-black font-medium",
});
