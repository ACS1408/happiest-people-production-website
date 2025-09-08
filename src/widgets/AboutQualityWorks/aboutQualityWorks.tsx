import React from "react";
import Container from "@/components/Container";
import Image from "next/image";
import { twc } from "@/utils";

const AboutQualityWorks = () => {
  return (
    <section
      data-widget="about-quality-works"
      className={`about-quality-works ${twClasses.section}`}
    >
      <Container>
        <div className={`about-quality-works__grid ${twClasses.grid}`}>
          <figure className={`about-quality-works__image ${twClasses.image}`}>
            <Image
              src="/images/security.webp"
              alt="yellow tv"
              fill
              className="object-contain"
            />
          </figure>
          <div
            className={`about-quality-works__contents ${twClasses.contents}`}
          >
            <h2 className={`about-quality-works__title ${twClasses.title}`}>
              We ensure quality <em className="font-medium">works</em>
            </h2>
            <p
              className={`about-quality-works__description ${twClasses.description}`}
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
  title: "fs-title-tertiary ff-figtree max-w-md leading-tight font-light",
  description: "mt-10 leading-relaxed ps-2 fs-para-secondary max-w-lg",
});
