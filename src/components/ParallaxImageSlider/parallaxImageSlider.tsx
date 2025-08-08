import React from "react";
import Image from "next/image";
import type { ImageType } from "@/types/typeUtils";
import { twc } from "@/utils";

interface ParallaxImageSlider {
  images: ImageType[];
}

const ParallaxImageSlider: React.FC<ParallaxImageSlider> = ({
  images,
  ...props
}) => {
  return (
    <div
      data-component="parallax-image-slider"
      className={`parallax-image-slider ${twClasses.slider}`}
      {...props}
    >
      <div className={twClasses.outer}>
        <div className={twClasses.wrapper}>
          {images &&
            images?.length !== 0 &&
            images?.map((image, i) => {
              return (
                <div
                  className={`${twClasses.slide} ${
                    (i + 1) % 3 === 0
                      ? twClasses.slide.ratio_3
                      : (i + 1) % 3 === 2
                      ? twClasses.slide.ratio_2
                      : twClasses.slide.ratio_1
                  }`}
                  key={i}
                >
                  <figure className={`${twClasses.image}`}>
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
  outer: "",
  wrapper: "flex gap-4 overflow-auto no-scrollbar",
  image: "relative h-[400px]",
  slide: {
    DEFAULT: "overflow-hidden",
    ratio_1: "flex-[0_0_50%] max-w-[50%]",
    ratio_2: "flex-[0_0_25%] max-w-[25%]",
    ratio_3: "flex-[0_0_30%] max-w-[30%]",
  },
});
