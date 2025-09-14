"use client";
import React from "react";
import Container from "@/components/Container";
import Image from "next/image";
import useInsightsSlider from "./useAboutInsightsSlider";
import type { InsightSlide } from "@/types/aboutInsights";
import Icons from "@/utils/icons";
import { twc } from "@/utils";

const AboutInsights = () => {
  const { rootRef, contentRef, index, setSlideRef } = useInsightsSlider(slides);

  return (
    <section
      data-widget="about-insights"
      className={`about-insights ${twClasses.section}`}
    >
      <Container>
        <div className={`about-insights__grid ${twClasses.grid}`} ref={rootRef}>
          {/* Left Content */}
          <div className={`about-insights__grid--left ${twClasses.left}`}>
            <h1 className={`about-insights__title ${twClasses.title}`}>
              Insights from
              <br />
              <em className={`about-insights__title--em ${twClasses.title_em}`}>
                the mastermind
              </em>
            </h1>
            <div
              className={`about-insights__content ${twClasses.content}`}
              ref={contentRef}
            >
              <Icons.BlockQuote className="lg:h-8 h-4 text-white/70 shrink-0" />
              <div
                className={`about-insights__content--right ${twClasses.content_right}`}
              >
                <p
                  className={`about-insights__description ${twClasses.description}`}
                >
                  {slides[index].quote}
                </p>
                <div className={`about-insights__author ${twClasses.author}`}>
                  <div className={`author-name ${twClasses.author_name}`}>
                    {slides[index].author}
                  </div>
                  <div
                    className={`author-designation ${twClasses.author_designation}`}
                  >
                    {slides[index].designation}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Images */}
          <div
            className={`about-insights__image--wrapper ${twClasses.image_wrapper}`}
          >
            <figure
              className={`about-insights__image--figure ${twClasses.image_figure}`}
            >
              <div className={`about-insights__slides ${twClasses.slides}`}>
                {slides.map((s, i) => (
                  <div
                    key={i}
                    ref={(el) => setSlideRef(el, i)}
                    className="absolute inset-0"
                  >
                    <Image
                      src={s.image}
                      alt="insights"
                      fill
                      className={`about-insights__image ${twClasses.image}`}
                    />
                  </div>
                ))}
              </div>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutInsights;

const slides: InsightSlide[] = [
  {
    image: "/images/mastermind.webp",
    quote:
      "Dataravn empowers businesses with complete control over their SaaS backups, eliminating vendor lock-in",
    author: "Arun Kumar",
    designation: "Managing Director",
  },
  {
    image: "/images/workspace-1.webp",
    quote:
      "We deliver exceptional digital experiences through innovative solutions",
    author: "John Smith",
    designation: "Technical Director",
  },
  {
    image: "/images/workspace-2.webp",
    quote: "Our team's expertise drives transformative results for our clients",
    author: "Sarah Johnson",
    designation: "Creative Director",
  },
];

const twClasses = twc({
  section: "lg:py-32 py-16 bg-black",
  grid: "flex flex-wrap gap-12 items-center",
  left: "flex-1",
  content: "flex lg:gap-8 gap-6 mt-12",
  image_wrapper: "lg:flex-[0_0_40%] lg:max-w-[40%] flex-[0_0_100%] max-w-full",
  title:
    "fs-title-tertiary ff-figtree lg:text-6xl xl:text-7xl font-light text-white leading-tight",
  title_em:
    "bg-gradient-to-r from-white to-primary text-transparent bg-clip-text font-semibold pe-2",
  description: "text-gray-400 fs-para-secondary leading-relaxed max-w-md",
  image_figure: "relative aspect-[467/589]",
  content_right: "",
  author: "lg:mt-16 mt-10",
  author_name: "text-lg text-white",
  author_designation: "text-gray-400 text-md mt-2",
  slides: "w-full h-full relative overflow-hidden",
});
