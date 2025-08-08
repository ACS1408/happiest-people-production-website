import React from "react";
import Container from "@/components/Container";
import Image from "next/image";
import { twc } from "@/utils";

const HomeTailoredServices = () => {
  return (
    <section
      data-widget="home-tailored-service"
      className={`home-tailored-service ${twClasses.section}`}
    >
      <Container>
        <div className={`home-tailored-service__grid ${twClasses.grid}`}>
          <figure className={`home-tailored-service__image ${twClasses.image}`}>
            <Image
              src="/images/yellow-tv.png"
              alt="yellow tv"
              fill
              className="object-contain"
            />
          </figure>
          <div
            className={`home-tailored-service__contents ${twClasses.contents}`}
          >
            <h2 className={`home-tailored-service__title ${twClasses.title}`}>
              We serve <em className="font-semibold">wide tailored</em>
            </h2>
            <p
              className={`home-tailored-service__description ${twClasses.description}`}
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
  section: "bg-tertiary pt-32",
  grid: "grid grid-cols-2 gap-20",
  image: "relative aspect-square w-full",
  contents: "pt-20",
  title: "text-6xl max-w-96 leading-snug",
  description: "mt-10 leading-relaxed ps-2 text-para-primary max-w-96",
});
