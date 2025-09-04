import React from "react";
import Container from "@/components/Container";
import ParallaxImageSlider from "@/components/ParallaxImageSlider";
import useHomeWorkspace from "./useHomeWorkspace";
import { twc } from "@/utils";

const HomeWorkspace = () => {
  const { containerRef, descriptionRef } = useHomeWorkspace();
  return (
    <section
      className={`home-workspace ${twClasses.section}`}
      ref={containerRef}
    >
      <Container>
        <div className={`home-workspace__grid ${twClasses.grid}`}>
          <div className={`home-workspace__left ${twClasses.left}`}>
            <div className={`home-workspace__label ${twClasses.tag}`}>
              Work space
            </div>
            <h2 className={`home-workspace__title ${twClasses.title}`}>
              We serve
              <br />
              <em className="font-medium">workspace</em>
            </h2>
          </div>
          <div className={`home-workspace__right ${twClasses.right}`}>
            <p
              className={`home-workspace__description ${twClasses.description}`}
              ref={descriptionRef}
            >
              Dataravn empowers businesses with complete control over their SaaS
              backups, eliminating vendor lock-in and ensuring data security,
              compliance, and flexibility.
            </p>
          </div>
        </div>
      </Container>
      <div className={`home-workspace__slider ${twClasses.slider}`}>
        <ParallaxImageSlider images={sliderImages} />
      </div>
    </section>
  );
};

export default HomeWorkspace;

const sliderImages = [
  {
    url: "/images/workspace-1.webp",
    alt: "workspace-1",
    ratio: "ratio_1",
  },
  {
    url: "/images/workspace-2.webp",
    alt: "workspace-2",
    ratio: "ratio_2",
  },
  {
    url: "/images/workspace-3.webp",
    alt: "workspace-3",
    ratio: "ratio_3",
  },
  {
    url: "/images/workspace-1.webp",
    alt: "workspace-1",
    ratio: "ratio_1",
  },
  {
    url: "/images/workspace-2.webp",
    alt: "workspace-2",
    ratio: "ratio_2",
  },
  {
    url: "/images/workspace-3.webp",
    alt: "workspace-3",
    ratio: "ratio_3",
  },
];

const twClasses = twc({
  section: "lg:py-32 py-16 bg-white",
  grid: "flex",
  right: "flex-1",
  title: "fs-title-tertiary leading-tight",
  description: "lg:pt-40 pt-6 fs-para-primary max-w-2xl ms-auto",
  slider: "lg:mt-32 mt-20",
});
