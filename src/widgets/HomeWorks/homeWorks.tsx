import React from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import ImageCard from "@/components/ImageCard";
import Icons from "@/utils/icons";
import { twc } from "@/utils";

const HomeWorks = () => {
  return (
    <section
      data-widget="home-works"
      className={`home-works ${twClasses.section}`}
    >
      <Container>
        <div className="xl:flex xl:items-center">
          <h2 className={`home-works__title ${twClasses.title}`}>
            Our <em className="font-medium">Works</em>
          </h2>
          <p className={`home-works__description ${twClasses.description}`}>
            We value our clients as partners and are committed to delivering
            exceptional results tailored to their unique goals.
          </p>
        </div>
        <div className={`home-works__list ${twClasses.grid}`}>
          {works.map((work, index) => {
            return <ImageCard key={index} {...work} />;
          })}
        </div>
        <div className={`home-works__view-all ${twClasses.view_all}`}>
          <Button
            text="View All"
            icon={<Icons.ChevronRight className="h-3 mt-px" />}
            variant="outlined-with-icon"
            href="/works"
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
    videoId: "YPF9hUm4trM",
  },
  {
    title: "Shoot for AKG headset world 1 brand",
    image: {
      url: "/images/work-2.webp",
      alt: "work-2",
    },
    videoId: "YPF9hUm4trM",
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
