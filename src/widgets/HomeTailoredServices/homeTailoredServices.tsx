import React, { useRef } from "react";
import Container from "@/components/Container";
import Image from "next/image";
import { twc } from "@/utils";
import useTextSplitAnimation from "@/utils/useTextSplitAnimation";

const HomeTailoredServices = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  useTextSplitAnimation(titleRef, { stagger: 0, duration: 1.5 });
  useTextSplitAnimation(descRef, { stagger: 0, duration: 1.5 });

  return (
    <section
      data-widget="home-tailored-service"
      className={`home-tailored-service ${twClasses.section}`}
    >
      <Container>
        <div className={`home-tailored-service__grid ${twClasses.grid}`}>
          <figure className={`home-tailored-service__image ${twClasses.image}`}>
            <Image
              src="/images/yellow-tv.webp"
              alt="yellow tv"
              fill
              className="object-contain"
            />
          </figure>
          <div
            className={`home-tailored-service__contents ${twClasses.contents}`}
          >
            <h2
              className={`home-tailored-service__title ${twClasses.title}`}
              ref={titleRef}
            >
              We serve <em className="font-semibold">wide tailored</em>
            </h2>
            <p
              className={`home-tailored-service__description ${twClasses.description}`}
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

export default HomeTailoredServices;

const twClasses = twc({
  section: "bg-tertiary xl:pt-32 pt-16 max-xl:pb-16",
  grid: "grid lg:grid-cols-2 lg:gap-20",
  image: "relative aspect-square w-full -ms-[5%]",
  contents: "xl:pt-20 pt-8",
  title: "fs-title-tertiary sm:max-w-md max-w-[300px] leading-tight",
  description: "lg:mt-10 mt-6 leading-relaxed lg:ps-2 fs-para-secondary max-w-lg",
});
