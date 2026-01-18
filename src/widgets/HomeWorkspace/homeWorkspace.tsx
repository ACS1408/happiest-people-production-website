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
    url: "/images/workspace/bed-room.webp",
    alt: "Bed Room",
    ratio: "ratio_1",
  },
  {
    url: "/images/workspace/courtyard.webp",
    alt: "Courtyard",
    ratio: "ratio_2",
  },
  {
    url: "/images/workspace/di-out.webp",
    alt: "Di Out",
    ratio: "ratio_3",
  },
  {
    url: "/images/workspace/editing-room.webp",
    alt: "Editing Room",
    ratio: "ratio_1",
  },
  {
    url: "/images/workspace/enhance.webp",
    alt: "Enhance",
    ratio: "ratio_2",
  },
  {
    url: "/images/workspace/floor.webp",
    alt: "Floor",
    ratio: "ratio_3",
  },
  {
    url: "/images/workspace/hall-01.webp",
    alt: "Hall 01",
    ratio: "ratio_1",
  },
  {
    url: "/images/workspace/hall-02.webp",
    alt: "Hall 02",
    ratio: "ratio_2",
  },
  {
    url: "/images/workspace/makeup-room.webp",
    alt: "Makeup Room",
    ratio: "ratio_3",
  },
  {
    url: "/images/workspace/office.webp",
    alt: "Office",
    ratio: "ratio_1",
  },
  {
    url: "/images/workspace/set-int-01.webp",
    alt: "Set Int 01",
    ratio: "ratio_2",
  },
  {
    url: "/images/workspace/wall-set.webp",
    alt: "Wall Set",
    ratio: "ratio_3",
  },
  {
    url: "/images/workspace/wall-set-2.webp",
    alt: "Wall Set 2",
    ratio: "ratio_1",
  },
  {
    url: "/images/workspace/wall-set-5.webp",
    alt: "Wall Set 5",
    ratio: "ratio_2",
  },
  {
    url: "/images/workspace/wall-set-6.webp",
    alt: "Wall Set 6",
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
