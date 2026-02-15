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
              Opening doors to
              <br />
              <em className="font-medium">workspace</em>
            </h2>
          </div>
          <div className={`home-workspace__right ${twClasses.right}`}>
            <p
              className={`home-workspace__description ${twClasses.description}`}
              ref={descriptionRef}
            >
              A 2000 Sqft Studio Floor, Editing Suites, Professional Makeup Room
              with attached Bedroom, Dining Area, A vibrant Courtyard, DI Room
              with radiant Lights and Camera Unit – Will be provided for
              Projects.
              <br />
              <br />
              Every corner that’s thoughtfully crafted to support the creative
              process will be a Reel Retreat for Film makers, Artists and
              Storytellers. Whether you are in a Rim of a Concept or Reaping the
              Final Cut of a Creative, Our Space will transform your Work-Piece
              to a Masterpiece!
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
