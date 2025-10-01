import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { twc } from "@/utils";

interface ImageBlurLoaderProps extends Omit<ImageProps, "src"> {
  src: string;
  alt: string;
  wrapperClassName?: string;
  lowQualityImageClassName?: string;
  setIsImageLoaded?: (state: boolean) => void;
}

const ImageBlurLoader = ({
  src,
  alt,
  className,
  wrapperClassName,
  lowQualityImageClassName,
  setIsImageLoaded,
  ...props
}: ImageBlurLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const onImageLoad = () => {
    setTimeout(() => {
      setIsLoaded(true);
      setIsImageLoaded && setIsImageLoaded(true);
    }, 500);
  };

  return (
    <figure
      className={`${wrapperClassName} ${
        !isLoaded ? `${twClasses.blur_active.after}` : ""
      }`}
    >
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
        onLoad={() => onImageLoad()}
        {...props}
      />
    </figure>
  );
};

export default ImageBlurLoader;

const twClasses = twc({
  blur_active: {
    after:
      "after:content-[''] after:absolute after:inset-0 after:backdrop-blur-xl after:z-10",
  },
  low_quality: "object-cover z-[2] transition-opacity duration-500",
  high_quality: "object-cover",
});
