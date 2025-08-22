"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { ImageType } from "@/types/typeUtils";
import { twc } from "@/utils";
import useParallaxSlider from "./useParallaxSlider";
import Container from "../Container";

interface ParallaxImageSlider {
  images: ImageType[];
}

const ParallaxImageSlider: React.FC<ParallaxImageSlider> = ({
  images,
  ...props
}) => {
  const { main } = useParallaxSlider();
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1200);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const renderImages = () =>
    images?.map((image, i) => (
      <div
        className={`parallax-image-slider__slide ${twClasses.slide}`}
        key={i}
      >
        <figure
          className={`parallax-image-slider__image ${twClasses.image} aspect-video`}
        >
          <Image
            src={image?.url}
            fill
            alt={image?.alt}
            className="object-cover"
          />
        </figure>
      </div>
    ));

  if (!isLargeScreen) {
    return (
      <Container>
        <div className="grid min-[376px]:grid-cols-2 gap-3">
          {renderImages()}
        </div>
      </Container>
    );
  }

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
  image: "relative xl:h-[calc(100vh_-_200px)]",
  slide: {
    DEFAULT: "overflow-hidden",
    ratio_1: "flex-[0_0_50%] max-w-[50%]",
    ratio_2: "lg:flex-[0_0_25%] lg:max-w-[25%] flex-[0_0_50%] max-w-[50%]",
    ratio_3: "lg:flex-[0_0_30%] lg:max-w-[30%] flex-[0_0_50%] max-w-[50%]",
  },
});
