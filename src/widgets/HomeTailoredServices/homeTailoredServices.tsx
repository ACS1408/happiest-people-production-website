"use client";
import React from "react";
import Container from "@/components/Container";
import Image from "next/image";
import useHomeTailoredServices from "./useHomeTailoredServices";
import Icons from "@/utils/icons";
import { twc } from "@/utils";

const HomeTailoredServices = () => {
  const { asteriskRef } = useHomeTailoredServices();

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
            <h2 className={`home-tailored-service__title ${twClasses.title}`}>
              We serve{" "}
              <span className={`asterisk ${twClasses.asterisk}`}>
                <Icons.AsteriskIcon ref={asteriskRef} className="size-5" />
              </span>
              wide{" "}
              <em className={`font-semibold ${twClasses.title_em}`}>
                tailored
              </em>
            </h2>
            <p
              className={`home-tailored-service__description ${twClasses.description}`}
            >
              A Journey from the Smallest corners of our own Kitchen to a
              Well-Furnished Studio – Was Nothing but Pure Passion! Our Humble
              Personal Spaces and Every Word from a Satisfied Client not only
              Shaped the Creativity of our Team, It built an Unstoppable Brand
              too.
            </p>

            <p
              className={`home-tailored-service__description ${twClasses.description}`}
            >
              Today, standing as a Celebration of Passion, Persistence and
              Purpose, HAPPIEST PEOPLE PRODUCTION proves even the smallest
              beginnings can grow into something Extraordinary.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HomeTailoredServices;

const twClasses = twc({
  section: "bg-tertiary xl:py-32 py-16",
  grid: "grid lg:grid-cols-2 lg:gap-20",
  image: "relative aspect-square w-full -ms-[5%]",
  contents: "xl:pt-20 pt-8",
  title:
    "fs-title-tertiary ff-figtree sm:max-w-md max-w-[300px] leading-tight font-light flex flex-wrap items-center",
  description:
    "lg:mt-10 mt-6 leading-relaxed lg:ps-2 fs-para-secondary max-w-lg",
  title_em:
    "bg-gradient-to-r from-black to-primary text-transparent bg-clip-text font-semibold px-2",
  asterisk:
    "bg-primary size-11 rounded-full flex justify-center items-center ms-4 mt-4",
});
