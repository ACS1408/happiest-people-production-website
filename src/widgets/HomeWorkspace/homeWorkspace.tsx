import React, { useRef } from "react";
import Container from "@/components/Container";
import { twc } from "@/utils";
import ParallaxImageSlider from "@/components/ParallaxImageSlider";
import useTextSplitAnimation from "@/utils/useTextSplitAnimation";

const HomeWorkspace = () => {
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  useTextSplitAnimation(labelRef, { stagger: 0, duration: 1.5 });
  useTextSplitAnimation(titleRef, { stagger: 0.03 });
  useTextSplitAnimation(descRef, { stagger: 0, duration: 1.5 });

  return (
    <section className={`home-workspace ${twClasses.section}`}>
      <Container>
        <div className={`home-workspace__grid ${twClasses.grid}`}>
          <div className={`home-workspace__left ${twClasses.left}`}>
            <div
              className={`home-workspace__label ${twClasses.tag}`}
              ref={labelRef}
            >
              Work space
            </div>
            <h2
              className={`home-workspace__title ${twClasses.title}`}
              ref={titleRef}
            >
              We serve
              <br />
              <em className="font-medium">workspace</em>
            </h2>
          </div>
          <div className={`home-workspace__right ${twClasses.right}`}>
            <p
              className={`home-workspace__description ${twClasses.description}`}
              ref={descRef}
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
  grid: "lg:grid lg:grid-cols-2 lg:gap-3",
  title: "fs-title-tertiary leading-tight",
  description: "lg:pt-40 pt-6 fs-para-secondary max-w-md ms-auto",
  slider: "lg:mt-16 mt-10",
});
