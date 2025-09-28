"use client";
import Image from "next/image";
import React, { useState, useCallback } from "react";
import Button from "../Button";
import Icons from "@/utils/icons";
import { twc } from "@/utils";
import VideoModal from "../VideoModal";
import useFetchSignedWorkImages from "@/hooks/useFetchSignedWorkImages";

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
  const hasVideo = !!videoId;

  const { signedSrc, imgError, setImgError } = useFetchSignedWorkImages(
    image.url
  );

  const openVideo = useCallback(() => {
    if (hasVideo) setOpen(true);
  }, [hasVideo]);
  const closeVideo = useCallback(() => setOpen(false), []);

  return (
    <div
      data-component="image-card"
      className={`image-card ${twClasses.card} ${hasVideo ? "group" : ""}`}
    >
      <figure
        className={`image-card__image--wrapper ${twClasses.image_wrapper}`}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          openVideo();
        }}
      >
        {signedSrc ? (
          <Image
            src={signedSrc}
            alt={image.alt}
            fill
            className={`image-card__image ${twClasses.image} ${twClasses.image.group_hover}`}
            onError={() => setImgError("load error")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-500">
            IMG…
          </div>
        )}
        {imgError && (
          <div className="absolute inset-0 bg-neutral-900/50 flex items-center justify-center text-[10px] text-white text-center p-1">
            {imgError}
          </div>
        )}
      </figure>
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
  card: "group cursor-pointer",
  image_wrapper: "relative aspect-[766/430] w-full overflow-hidden",
  image: {
    DEFAULT: "transition-transform duration-300 object-cover",
    group_hover: "group-hover:scale-105",
  },
  title: "ff-manrope 2xl:mt-14 mt-8 2xl:text-2xl text-xl",
  action: "mt-4 w-max",
});
