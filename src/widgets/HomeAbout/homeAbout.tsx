import Button from "@/components/Button";
import React from "react";
import Image from "next/image";
import Container from "@/components/Container";
import SlotCounter from "@/components/SlotCounter";
import Icons from "@/utils/icons";
import { twc } from "@/utils";

const HomeAbout = () => {
  return (
    <section data-widget="home-about" className={twClasses.section}>
      <div className={`home-about__gradient ${twClasses.gradient}`} />
      <Container>
        <div
          className={`home-about__image--wrapper xl:hidden mb-10 ${twClasses.image_wrapper}`}
        >
          <figure
            className={`home-about__image--figure max-w-[80%] ${twClasses.image_figure}`}
          >
            <Image
              src="/images/golden-video-recorder.webp"
              alt="smiling golden video recorder"
              width="360"
              height="282"
              className={`home-about__image ${twClasses.image}`}
            />
          </figure>
        </div>
        <span className={`home-about__tag ${twClasses.tag}`}>About Us</span>
        <div className={`home-about__grid ${twClasses.grid}`}>
          <div className={`home-about__grid--left ${twClasses.left}`}>
            <h2 className={`home-about__title ${twClasses.title}`}>
              We serve a<br />
              wide{" "}
              <em className={`home-about__title--em ${twClasses.title_em}`}>
                tailored
              </em>
            </h2>

            <p className={`home-about__description ${twClasses.description}`}>
              Founded in 2020, Happiest People Production is an Indian based ad
              production company fueled by imagination and innovation, we
              specialize in bringing stories to life through powerful visuals
              and meaningful narratives. Our team creates a wide range of
              content for global clients, delivering campaigns that inspire,
              engage, and endure.
            </p>

            <p className={`home-about__description ${twClasses.description}`}>
              we craft TV commercials, Digital videos, Social media ads, product
              photography, and high-impact visuals that bring brands to life
              across every platform.
            </p>

            <Button
              href="/about-us"
              text="About Us"
              icon={<Icons.ArrowRight className="h-3 mt-px" />}
              variant="link-with-icon"
              className={`home-about__button ${twClasses.button}`}
              color="white"
            />
          </div>

          <div
            className={`home-about__image--wrapper xl:block hidden ${twClasses.image_wrapper}`}
          >
            <figure
              className={`home-about__image--figure ${twClasses.image_figure}`}
            >
              <Image
                src="/images/golden-video-recorder.webp"
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
            <div key={i} className={twClasses.stat(i)}>
              <div
                className={`home-about__stats--count ${twClasses.stat_count}`}
              >
                <SlotCounter target={count} duration={3} />
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
  section: "relative bg-black text-white lg:py-32 py-16 overflow-hidden",
  gradient:
    "absolute top-0 right-0 w-96 translate-x-[40%] h-96 bg-gradient-to-bl from-primary via-primary-900 to-transparent opacity-30 rounded-full blur-3xl",
  tag: "inline-block bg-gray-900 text-white px-3.5 py-1.5 rounded-full text-sm font-medium mb-8",
  grid: "grid xl:grid-cols-2 gap-12 items-center mb-20",
  left: "space-y-8",
  title:
    "fs-title-secondary ff-figtree lg:text-6xl xl:text-7xl font-light leading-tight",
  title_em:
    "bg-gradient-to-r from-white to-primary text-transparent bg-clip-text font-semibold pe-2",
  description: "text-gray-400 text-lg leading-relaxed max-w-xl",
  button: "mt-4 w-max",
  image_wrapper: "flex justify-center items-start",
  image_figure: "relative lg:-mt-16 flex justify-center",
  image: "object-contain",
  stats: "flex flex-wrap md:justify-between max-md:gap-y-8",
  stat: (index: number) =>
    `text-left md:flex-1 xl:px-16 lg:px-8 px-6 max-md:flex-[0_0_50%] max-md:max-w-[50%] ${
      index !== 0 ? "md:seperator-r" : "!pl-0"
    } ${index % 2 === 1 ? "max-md:seperator-r" : "max-md:!pl-0"}`,
  stat_count:
    "ff-figtree text-4xl lg:text-5xl xl:text-6xl font-medium text-white mb-2",
  stat_label: "text-gray-400 text-sm lg:text-base",
});
