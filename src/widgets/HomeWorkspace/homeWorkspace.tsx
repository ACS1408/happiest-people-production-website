"use client";
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
              We provide fully equipped editing suites, a 2000 sq ft studio
              floor, a dedicated makeup room with an attached bedroom, a dining
              area, a vibrant courtyard, a DI room along with a dedicated light
              and camera unit.
              <br />
              <br />
              Every corner is thoughtfully crafted to support the creative
              process, making it a peaceful heaven for filmmakers, artists, and
              storytellers. Whether you’re shaping a concept or perfecting the
              final cut, our space is made to help you create your best work.
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
  grid: "xl:flex",
  right: "flex-1",
  title: "fs-title-tertiary ff-figtree leading-tight font-light",
  description: "xl:pt-40 lg:pt-12 pt-6 fs-para-primary max-w-2xl xl:ml-auto",
  slider: "xl:mt-32 mt-12",
});
