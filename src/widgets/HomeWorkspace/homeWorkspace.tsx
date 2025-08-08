import React from "react";
import Container from "@/components/Container";
import { twc } from "@/utils";
import ParallaxImageSlider from "@/components/ParallaxImageSlider";

const HomeWorkspace = () => {
  return (
    <section className={`home-workspace ${twClasses.section}`}>
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
    url: "/images/workspace-1.jpg",
    alt: "workspace-1",
  },
  {
    url: "/images/workspace-2.jpg",
    alt: "workspace-2",
  },
  {
    url: "/images/workspace-3.jpg",
    alt: "workspace-3",
  },
  {
    url: "/images/workspace-1.jpg",
    alt: "workspace-1",
  },
  {
    url: "/images/workspace-2.jpg",
    alt: "workspace-2",
  },
  {
    url: "/images/workspace-3.jpg",
    alt: "workspace-3",
  },
];

const twClasses = twc({
  section: "py-32",
  grid: "grid grid-cols-2 gap-3",
  title: "fs-title-tertiary leading-tight",
  description: "pt-40 fs-para-secondary max-w-md ms-auto",
  slider: "mt-16",
});
