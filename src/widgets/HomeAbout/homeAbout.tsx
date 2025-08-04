import Button from "@/components/Button";
import React from "react";
import ArrowRight from "@/icons/arrow-right.svg";
import { twc } from "@/utils";
import Image from "next/image";
import Container from "@/components/Container";

const HomeAbout = () => {
  return (
    <section data-widget="home-about" className={twClasses.section}>
      <div className={`home-about__gradient ${twClasses.gradient}`} />
      <Container>
        <span className={`home-about__tag ${twClasses.tag}`}>About Us</span>
        <div className={`home-about__grid ${twClasses.grid}`}>
          <div className={`home-about__grid--left ${twClasses.left}`}>
            <h1 className={`home-about__title ${twClasses.title}`}>
              We serve a<br />
              wide{" "}
              <em className={`home-about__title--em ${twClasses.title_em}`}>
                tailored
              </em>
            </h1>

            <p className={`home-about__description ${twClasses.description}`}>
              Lorem ipsum solutions tailored to tackle specific challenges
            </p>

            <Button
              href="/about-us"
              text="About Us"
              icon={<ArrowRight />}
              variant="link-with-icon"
              className={`home-about__button ${twClasses.button}`}
              color="white"
            />
          </div>

          <div
            className={`home-about__image--wrapper ${twClasses.image_wrapper}`}
          >
            <figure
              className={`home-about__image--figure ${twClasses.image_figure}`}
            >
              <Image
                src="/images/golden-video-recorder.png"
                alt="smiling golden video recorder"
                width="360"
                height="282"
                className={`home-about__image ${twClasses.image}`}
              />
            </figure>
          </div>
        </div>

        <div className={`home-about__stats ${twClasses.stats}`}>
          {stats.map(({ count, label }, i) => (
            <div key={i} className={twClasses.stat(i !== 0)}>
              <div
                className={`home-about__stats--count ${twClasses.stat_count}`}
              >
                {count}
              </div>
              <div
                className={`home-about__stats--label ${twClasses.stat_label}`}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HomeAbout;

const stats = [
  { count: "300+", label: "Customer globally" },
  { count: "200+", label: "Experts of team" },
  { count: "36+", label: "Countries served" },
  { count: "12+", label: "Year of experience" },
];

const twClasses = twc({
  section: "relative bg-black text-white py-32 overflow-hidden",
  gradient:
    "absolute top-0 right-0 w-96 translate-x-[40%] h-96 bg-gradient-to-bl from-primary via-primary-900 to-transparent opacity-30 rounded-full blur-3xl",
  tag: "inline-block bg-gray-900 text-white px-3.5 py-1.5 rounded-full text-sm font-medium mb-8",
  grid: "grid lg:grid-cols-2 gap-12 items-center mb-20",
  left: "space-y-8",
  title: "text-5xl lg:text-6xl xl:text-7xl font-light leading-tight",
  title_em:
    "bg-gradient-to-r from-white to-primary text-transparent bg-clip-text font-semibold pe-2",
  description: "text-gray-400 text-lg leading-relaxed max-w-md",
  button: "mt-4 w-max",
  image_wrapper: "flex justify-center items-start",
  image_figure: "relative lg:-mt-16",
  image: "object-contain",
  stats: "grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12",
  stat: (hasBorder: boolean) =>
    `text-center lg:text-left ${
      hasBorder ? "border-l border-gray-700 pl-8 lg:pl-12" : ""
    }`,
  stat_count:
    "ff-figtree text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-2",
  stat_label: "text-gray-400 text-sm lg:text-base",
});
