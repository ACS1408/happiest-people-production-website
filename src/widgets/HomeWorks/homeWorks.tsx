import React, { useRef } from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Image from "next/image";
import ChevronRight from "@/icons/chevron-right.svg";
import { twc } from "@/utils";
import useTextSplitAnimation from "@/utils/useTextSplitAnimation";
import ImageCard from "@/components/ImageCard";

const HomeWorks = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  useTextSplitAnimation(titleRef, { stagger: 0, duration: 1.5 });
  useTextSplitAnimation(descRef, { stagger: 0, duration: 1.5 });

  return (
    <section
      data-widget="home-works"
      className={`home-works ${twClasses.section}`}
    >
      <Container>
        <div className="xl:flex xl:items-center">
          <h2 className={`home-works__title ${twClasses.title}`} ref={titleRef}>
            Our <em className="font-medium">Works</em>
          </h2>
          <p
            className={`home-works__description ${twClasses.description}`}
            ref={descRef}
          >
            We value our clients as partners and are committed to delivering
            exceptional results tailored to their unique goals.
          </p>
        </div>
        <div className={`home-works__list ${twClasses.grid}`}>
          {works.map(({ title, image }, index) => {
            return <ImageCard key={index} image={image} title={title} />;
          })}
        </div>
        <div className={`home-works__view-all ${twClasses.view_all}`}>
          <Button
            text="View All"
            icon={<ChevronRight className="h-3 mt-px" />}
            variant="outlined-with-icon"
            href="/all-works"
            color="black"
          />
        </div>
      </Container>
    </section>
  );
};

export default HomeWorks;

const works = [
  {
    title: "Shoot for world best head phones nirvana",
    image: {
      url: "/images/work-1.webp",
      alt: "work-1",
    },
  },
  {
    title: "Shoot for AKG headset world 1 brand",
    image: {
      url: "/images/work-2.webp",
      alt: "work-2",
    },
  },
];

const twClasses = twc({
  section: "2xl:py-48 xl:32 md:py-20 py-16 bg-white",
  title:
    "ff-figtree fs-title-tertiary font-light flex-[0_0_600px] max-w-[600px]",
  description: "fs-para-secondary max-w-[638px] xl:ms-auto mt-4 xl:mt-0",
  grid: "grid md:grid-cols-2 md:gap-4 gap-10 2xl:mt-32 mt-16",
  view_all: "flex justify-center xl:mt-20 mt-12",
});
