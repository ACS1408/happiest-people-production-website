import React from "react";
import Container from "@/components/Container";
import Image from "next/image";
import { twc } from "@/utils";
import BlockQuote from "@/icons/blockquotes.svg";

const AboutInsights = () => {
  return (
    <section
      data-widget="about-insights"
      className={`about-insights ${twClasses.section}`}
    >
      <Container>
        <div className={`about-insights__grid ${twClasses.grid}`}>
          <div className={`about-insights__grid--left ${twClasses.left}`}>
            <h1 className={`about-insights__title ${twClasses.title}`}>
              Insights from
              <br />
              <em className={`about-insights__title--em ${twClasses.title_em}`}>
                the mastermind
              </em>
            </h1>
            <div className={`about-insights__content ${twClasses.content}`}>
              <BlockQuote className="h-8" />
              <div
                className={`about-insights__content--right ${twClasses.content_right}`}
              >
                <p
                  className={`about-insights__description ${twClasses.description}`}
                >
                  Dataravn empowers businesses with complete control over their
                  SaaS backups, eliminating vendor lock-in
                </p>
                <div className={`about-insights__author ${twClasses.author}`}>
                  <div className={`author-name ${twClasses.author_name}`}>
                    Arun Kumar
                  </div>
                  <div
                    className={`author-designation ${twClasses.author_designation}`}
                  >
                    Managing Director
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`about-insights__image--wrapper ${twClasses.image_wrapper}`}
          >
            <figure
              className={`about-insights__image--figure ${twClasses.image_figure}`}
            >
              <Image
                src="/images/mastermind.webp"
                alt="mastermind"
                fill
                className={`about-insights__image ${twClasses.image}`}
              />
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutInsights;

const twClasses = twc({
  section: "py-32 bg-black",
  grid: "flex gap-12 items-center",
  left: "flex-1",
  content: "flex gap-8 mt-12",
  image_wrapper: "flex-[0_0_40%] max-w-[40%]",
  title:
    "fs-title-tertiary lg:text-6xl xl:text-7xl font-light text-white leading-tight",
  title_em:
    "bg-gradient-to-r from-white to-primary text-transparent bg-clip-text font-semibold pe-2",
  description: "text-gray-400 fs-para-secondary leading-relaxed max-w-md",
  image_figure: "relative aspect-[467/589]",
  content_right: "",
  author: "mt-16",
  author_name: "text-lg text-white",
  author_designation: "text-gray-400 text-md mt-2",
});
