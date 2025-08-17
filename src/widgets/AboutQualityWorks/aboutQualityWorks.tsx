import Container from "@/components/Container";
import { twc } from "@/utils";
import useTextSplitAnimation from "@/utils/useTextSplitAnimation";
import Image from "next/image";
import React, { useRef } from "react";

const AboutQualityWorks = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  useTextSplitAnimation(titleRef, { stagger: 0.03 });
  useTextSplitAnimation(descRef, { stagger: 0, duration: 1.5 });

  return (
    <section
      data-widget="about-quality-works"
      className={`about-quality-works ${twClasses.section}`}
    >
      <Container>
        <div className={`about-quality-works__grid ${twClasses.grid}`}>
          <figure className={`about-quality-works__image ${twClasses.image}`}>
            <Image
              src="/images/yellow-tv.png"
              alt="yellow tv"
              fill
              className="object-contain"
            />
          </figure>
          <div
            className={`about-quality-works__contents ${twClasses.contents}`}
          >
            <h2
              className={`about-quality-works__title ${twClasses.title}`}
              ref={titleRef}
            >
              We ensure <em className="font-semibold">quality works</em>
            </h2>
            <p
              className={`about-quality-works__description ${twClasses.description}`}
              ref={descRef}
            >
              HPP empowers businesses with complete control over their SaaS
              backups, eliminating vendor lock-in
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutQualityWorks;

const twClasses = twc({
  section: "bg-tertiary pt-32",
  grid: "grid grid-cols-2 gap-20",
  image: "relative aspect-square w-full",
  contents: "pt-20",
  title: "fs-title-tertiary max-w-md leading-tight",
  description: "mt-10 leading-relaxed ps-2 fs-para-secondary max-w-lg",
});
