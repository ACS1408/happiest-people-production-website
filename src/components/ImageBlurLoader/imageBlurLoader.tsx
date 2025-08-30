"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { twc } from "@/utils";

interface ImageBlurLoaderProps extends Omit<ImageProps, "src"> {
  src: string;
  alt: string;
  lowQualityImageClassName?: string;
}

const ImageBlurLoader = ({
  src,
  alt,
  className,
  lowQualityImageClassName,
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
        } ${className} ${lowQualityImageClassName}`}
      />

      {/* High quality image */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`image ${twClasses.high_quality} ${className}`}
        quality={100}
        onLoad={() => setTimeout(() => setIsLoaded(true), 500)}
        {...props}
      />
    </>
  );
};

export default ImageBlurLoader;

const twClasses = twc({
  low_quality: "object-cover blur-lg z-[2] transition-opacity duration-500",
  high_quality: "object-cover",
});
