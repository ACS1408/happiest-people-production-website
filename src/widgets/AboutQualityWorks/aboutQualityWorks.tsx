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
              Quality over <em className="font-medium">Conversation</em>
            </h2>
            <p
              className={`about-quality-works__description ${twClasses.description}`}
            >
              With more Energy in Action and Much Quality in Conversations, We
              craft your Target to #Trending
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutQualityWorks;

const twClasses = twc({
  section: "bg-tertiary lg:pt-32 pt-16 xl:pb-0 lg:pb-32 pb-16",
  grid: "xl:grid xl:grid-cols-2 xl:gap-20 gap-16 lg:flex",
  image:
    "relative aspect-square w-full max-xl:flex-[0_0_40%] max-xl:max-w-[40%] max-sm:flex-[0_0_70%] max-sm:max-w-[70%]",
  contents: "lg:pt-20 pt-10",
  title: "fs-title-tertiary ff-figtree max-w-md leading-tight font-light",
  description: "mt-10 leading-relaxed ps-2 fs-para-secondary max-w-lg",
});
