import React from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import ParallaxImageSlider from "@/components/ParallaxImageSlider";
import Icons from "@/utils/icons";
import { twc } from "@/utils";

const AboutCareers = () => {
  return (
    <section
      data-widget="about-careers"
      className={`about-careers ${twClasses.section}`}
    >
      <Container>
        <h2 className={`about-careers__title ${twClasses.title}`}>
          Ready to roll?
          <br />
          <em className="font-medium">together</em>
        </h2>

        <div className={`about-careers__contents ${twClasses.contents}`}>
          <p className={`about-careers__description ${twClasses.description}`}>
            HAPPY PEOPLE PRODUCTION, Welcomes the Creativity in you Onboard!
          </p>
          <p
            className={`about-careers__description ${twClasses.description} !mt-6`}
          >
            If you believe You can Generate, Shape and Execute Quality Contents
            - You can join our Team. For More Info Click!
          </p>

          <div className="mt-16 w-max">
            <Button
              text="Careers"
              icon={<Icons.ChevronRight className="h-3 mt-px" />}
              variant="outlined-with-icon"
              href="/careers"
              color="white"
            />
          </div>
        </div>
      </Container>

      <div
        data-cursor-text="Scroll"
        className={`about-careers__slider ${twClasses.slider}`}
      >
        <ParallaxImageSlider images={sliderImages} />
      </div>
    </section>
  );
};

export default AboutCareers;

const sliderImages = [
  {
    url: "/images/career-1.webp",
    alt: "career-1",
    ratio: "ratio_1",
  },
  {
    url: "/images/career-2.webp",
    alt: "career-2",
    ratio: "ratio_2",
  },
  {
    url: "/images/career-3.webp",
    alt: "career-3",
    ratio: "ratio_2",
  },
  {
    url: "/images/career-1.webp",
    alt: "career-1",
    ratio: "ratio_1",
  },
  {
    url: "/images/career-2.webp",
    alt: "career-2",
    ratio: "ratio_2",
  },
  {
    url: "/images/career-3.webp",
    alt: "career-3",
    ratio: "ratio_2",
  },
];

const twClasses = twc({
  section: "lg:py-32 py-16 bg-black",
  tag: "",
  title: "fs-title-tertiary ff-figtree leading-tight text-white font-light",
  contents: "max-w-[576px] lg:ml-auto",
  description: "fs-para-secondary lg:mt-20 mt-10 text-white",
  slider: "mt-16",
});
