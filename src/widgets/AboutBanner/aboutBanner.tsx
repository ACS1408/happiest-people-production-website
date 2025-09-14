"use client";
import React from "react";
import Container from "@/components/Container";
import SlotCounter from "@/components/SlotCounter";
import AboutBannerIllustration from "@/components/AnimatedIllustrations/AboutBannerIllustration";

const AboutBanner = () => {
  return (
    <section
      data-widget="about-banner"
      className={`about-banner ${twClasses.section}`}
    >
      <Container>
        <div className={`about-banner__label ${twClasses.tag}`}>Work space</div>
        <h2 className={`about-banner__title ${twClasses.title}`}>
          We serve
          <br />
          <em className="font-medium">workspace</em>
        </h2>

        <AboutBannerIllustration />

        <div className={`about-banner__contents ${twClasses.contents}`}>
          <p className={`about-banner__description ${twClasses.description}`}>
            Dataravn empowers businesses with complete control over their SaaS
            backups, eliminating vendor lock-in and ensuring data security,
            compliance, and flexibility.
          </p>

          <div className={`about-banner__stats ${twClasses.stats}`}>
            {stats.map(({ count, label }, i) => (
              <div key={i} className={twClasses.stat(i !== 0)}>
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
        </div>
      </Container>
    </section>
  );
};

export default AboutBanner;

const stats = [
  { count: "100+", label: "Customer globally" },
  { count: "300+", label: "Experts of team" },
];

const twClasses = {
  section: "pt-12 lg:pb-32 pb-16 bg-white mt-[122.6px]",
  tag: "",
  title: "fs-title-tertiary ff-figtree leading-tight font-light",
  contents: "max-w-[768px] ms-auto",
  description: "fs-para-secondary lg:mt-20 mt-10",
  stats: "flex items-center mt-10",
  stat: (hasBorder: boolean) =>
    `text-center lg:text-left px-8 lg:px-16 ${
      hasBorder ? "border-l border-gray-300" : "pl-0"
    }`,
  stat_count:
    "ff-figtree text-4xl lg:text-5xl xl:text-6xl font-medium text-black mb-2",
  stat_label: "text-gray-400 text-sm lg:text-base",
};
