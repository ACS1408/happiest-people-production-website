import Button from "@/components/Button";
import Container from "@/components/Container";
import React from "react";
import ChevronRight from "@/icons/chevron-right.svg";
import ParallaxImageSlider from "@/components/ParallaxImageSlider";

const AboutCareers = () => {
  return (
    <section
      data-widget="about-careers"
      className={`about-careers ${twClasses.section}`}
    >
      <Container>
        <div className={`about-careers__label ${twClasses.tag}`}>
          Work space
        </div>
        <h2 className={`about-careers__title ${twClasses.title}`}>
          We serve
          <br />
          <em className="font-medium">workspace</em>
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
              icon={<ChevronRight className="h-3 mt-px" />}
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
    url: "/images/workspace-1.jpg",
    alt: "workspace-1",
  },
  {
    url: "/images/workspace-2.jpg",
    alt: "workspace-2",
  },
  {
    url: "/images/workspace-3.jpg",
    alt: "workspace-3",
  },
  {
    url: "/images/workspace-1.jpg",
    alt: "workspace-1",
  },
  {
    url: "/images/workspace-2.jpg",
    alt: "workspace-2",
  },
  {
    url: "/images/workspace-3.jpg",
    alt: "workspace-3",
  },
];

const twClasses = {
  section: "py-32 bg-black",
  tag: "",
  title: "fs-title-tertiary leading-tight text-white",
  contents: "max-w-[576px] ms-auto",
  description: "fs-para-secondary mt-20 text-white",
  slider: "mt-16",
};
