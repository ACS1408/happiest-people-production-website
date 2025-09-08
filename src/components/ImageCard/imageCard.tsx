import Image from "next/image";
import React from "react";
import Button from "../Button";
import Icons from "@/utils/icons";
import { twc } from "@/utils";

interface ImageCardProps {
  image: {
    url: string;
    alt: string;
  };
  title: string;
}

const ImageCard = ({ image, title }: ImageCardProps) => {
  return (
    <div data-component="image-card" className={`image-card ${twClasses.card}`}>
      <figure
        className={`image-card__image--wrapper ${twClasses.image_wrapper}`}
      >
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className={`image-card__image ${twClasses.image} ${twClasses.image.group_hover}`}
        />
      </figure>
      <h3 className={`image-card__title ${twClasses.title}`}>{title}</h3>
      <Button
        text="Watch Now"
        icon={<Icons.ChevronRight className="h-3 mt-px" />}
        variant="link-with-icon"
        className={`image-card__action ${twClasses.action}`}
        as="div"
        color="black"
      />
    </div>
  );
};

export default ImageCard;

const twClasses = twc({
  card: "group cursor-pointer",
  image_wrapper: "relative aspect-[766/430] w-full overflow-hidden",
  image: {
    DEFAULT: "transition-transform duration-300",
    group_hover: "group-hover:scale-105",
  },
  title: "ff-manrope 2xl:mt-14 mt-8 2xl:text-2xl text-xl",
  action: "mt-4 w-max",
});
