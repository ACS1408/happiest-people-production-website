import React from "react";
import Container from "@/components/Container";
import ImageCard from "@/components/ImageCard";
import { twc } from "@/utils";

const WorksList = () => {
  return (
    <section
      data-widget="works-list"
      className={`works-list ${twClasses.section}`}
    >
      <Container>
        <h2 className={`works-list__title ${twClasses.title}`}>
          Our <em className="font-medium">Works</em>
        </h2>
        <ul className={`works-list__items ${twClasses.grid}`}>
          {works.map(({ title, image }, index) => {
            return (
              <li className={`works-list__item`} key={index}>
                <ImageCard image={image} title={title} />
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
};

export default WorksList;

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
  {
    title: "Shoot for world best head phones nirvana",
    image: {
      url: "/images/work-3.webp",
      alt: "work-3",
    },
  },
  {
    title: "Shoot for world best head phones nirvana",
    image: {
      url: "/images/work-4.webp",
      alt: "work-4",
    },
  },
  {
    title: "Shoot for world best head phones nirvana",
    image: {
      url: "/images/work-5.webp",
      alt: "work-5",
    },
  },
  {
    title: "Shoot for world best head phones nirvana",
    image: {
      url: "/images/work-6.webp",
      alt: "work-6",
    },
  },
];

const twClasses = twc({
  section: "pt-12 pb-32 mt-[122.6px] bg-white",
  title: "ff-figtree fs-title-tertiary font-light",
  grid: "grid md:grid-cols-2 md:gap-x-4 gap-x-10 md:gap-y-12 gap-y-8 2xl:mt-32 mt-16",
});
