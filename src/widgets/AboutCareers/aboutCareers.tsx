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
          We ready to
          <br />
          wide <em className="font-medium">together</em>
        </h2>

        <div className={`about-careers__contents ${twClasses.contents}`}>
          <p className={`about-careers__description ${twClasses.description}`}>
            Dataravn empowers businesses with complete control over their SaaS
            backups, eliminating vendor lock-in and ensuring data security,
            compliance, and flexibility.
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

      <div className={`about-careers__slider ${twClasses.slider}`}>
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
  section: "py-32 bg-black",
  tag: "",
  title: "fs-title-tertiary ff-figtree leading-tight text-white font-light",
  contents: "max-w-[576px] ms-auto",
  description: "fs-para-secondary mt-20 text-white",
  slider: "mt-16",
});
