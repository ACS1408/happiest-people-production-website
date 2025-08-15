"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { twc } from "@/utils";

interface ImageBlurLoaderProps extends Omit<ImageProps, "src"> {
  src: string;
  alt: string;
}

const ImageBlurLoader = ({
  src,
  alt,
  className,
  ...props
}: ImageBlurLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {/* Low quality placeholder */}
      <Image
        src={src}
        alt={alt}
        aria-hidden="true"
        fill
        quality={10}
        className={`${twClasses.low_quality} ${
          isLoaded ? "opacity-0" : "opacity-100"
        } ${className}`}
      />

      {/* High quality image */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`image ${twClasses.high_quality} ${className}`}
        quality={100}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </>
  );
};

export default ImageBlurLoader;

const twClasses = twc({
  low_quality: "object-cover blur-2xl scale-105 transition-opacity duration-500",
  high_quality: "object-cover transition-opacity duration-500",
});
