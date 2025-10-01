"use client";
import Image from "next/image";
import React, { useState, useCallback } from "react";
import Button from "../Button";
import Icons from "@/utils/icons";
import { twc } from "@/utils";
import VideoModal from "../VideoModal";
import useFetchSignedWorkImages from "@/hooks/useFetchSignedWorkImages";
import ImageBlurLoader from "../ImageBlurLoader";

interface ImageCardProps {
  image: {
    url: string;
    alt: string;
  };
  title: string;
  videoId?: string; // Optional YouTube video ID
}

const ImageCard = ({ image, title, videoId }: ImageCardProps) => {
  const [open, setOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const hasVideo = !!videoId;

  const { signedSrc, imgError, setImgError } = useFetchSignedWorkImages(
    image.url
  );

  const openVideo = useCallback(() => {
    if (hasVideo) setOpen(true);
  }, [hasVideo]);
  const closeVideo = useCallback(() => setOpen(false), []);

  console.log("imgError: ", imgError);

  return (
    <div
      data-component="image-card"
      className={`image-card ${twClasses.card} ${hasVideo ? "group" : ""}`}
    >
      {signedSrc ? (
        <>
          <ImageBlurLoader
            src={signedSrc}
            alt={image.alt}
            fill
            className={`image-card__image ${twClasses.image} ${twClasses.image.group_hover}`}
            onError={() => setImgError("load error")}
            wrapperClassName={`image-card__image--wrapper ${
              twClasses.image_wrapper
            }  ${!isImageLoaded ? "opacity-0" : ""}`}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              openVideo();
            }}
            setIsImageLoaded={(state) => setIsImageLoaded(state)}
          />
          {!isImageLoaded ? (
            <div
              className={`${twClasses.image_wrapper} bg-gray-200 flex items-center justify-center p-5 !absolute inset-0`}
            >
              <Image
                src="/images/placeholder-icon.png"
                alt="placeholder-icon"
                width={90}
                height={90}
                className="object-contain"
              />
            </div>
          ) : null}
        </>
      ) : (
        <div
          className={`${twClasses.image_wrapper} bg-gray-200 flex items-center justify-center p-5`}
        >
          <Image
            src="/images/placeholder-icon.png"
            alt="placeholder-icon"
            width={90}
            height={90}
            className="object-contain"
          />
        </div>
      )}
      <h3 className={`image-card__title ${twClasses.title}`}>{title}</h3>
      {hasVideo && (
        <Button
          text="Watch Now"
          icon={<Icons.ChevronRight className="h-3 mt-px" />}
          variant="link-with-icon"
          className={`image-card__action ${twClasses.action}`}
          as="button"
          type="button"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            openVideo();
          }}
          color="black"
        />
      )}
      {hasVideo && (
        <VideoModal
          videoId={videoId!}
          open={open}
          onClose={closeVideo}
          title={title}
          animationDurationMs={300}
        />
      )}
    </div>
  );
};

export default ImageCard;

const twClasses = twc({
  card: "group cursor-pointer relative",
  image_wrapper: "relative aspect-[766/430] w-full overflow-hidden",
  image: {
    DEFAULT: "transition-transform duration-300 object-cover",
    group_hover: "group-hover:scale-105",
  },
  title: "ff-manrope 2xl:mt-14 mt-8 2xl:text-2xl text-xl",
  action: "mt-4 w-max",
});
