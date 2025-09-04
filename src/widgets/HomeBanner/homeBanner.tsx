import React from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import ArrowRight from "@/icons/arrow-right.svg";
import ImageBlurLoader from "@/components/ImageBlurLoader/imageBlurLoader";
import { twc } from "@/utils";

const HomeBanner = () => {
  return (
    <section
      data-widget="home-banner"
      className={`home-banner ${twClasses.section} ${twClasses.section.before}`}
    >
      <figure className={`home-banner__bg ${twClasses.background}`}>
        <ImageBlurLoader
          src="/images/banner-image.webp"
          fill
          alt="people working together new movie"
          className="object-cover"
          lowQualityImageClassName="scale-105"
        />
      </figure>
      <div className={`home-banner__contents ${twClasses.contents}`}>
        <Container>
          <h1 className={`home-banner__contents--title ${twClasses.title}`}>
            <span>Crafting</span>
            <br />
            <span>
              impactful <em className="font-medium">ads</em>
            </span>
          </h1>
          <Button
            href="/contact-us"
            text="Contact Us"
            icon={<ArrowRight className="h-3 pt-px" />}
            variant="link-with-icon"
            className={`home-banner__contents--button ${twClasses.button}`}
            color="white"
          />
        </Container>
      </div>
    </section>
  );
};

export default HomeBanner;

const twClasses = twc({
  section: {
    DEFAULT:
      "w-full lg:h-[calc(100svh_-89.51px)] h-[calc(100svh_-73.5px)] relative",
    before:
      "before:content-[''] before:bg-gradient-to-b before:from-black before:via-transparent before:to-black before:absolute before:inset-0 before:z-[9]",
  },
  background: "absolute top-0 left-0 size-full overflow-hidden",
  contents: "relative z-10 h-full flex items-end py-16",
  title:
    "ff-figtree max-w-[713px] fs-title-primary font-light leading-[1.1] text-white",
  button: "mt-16 w-max",
});
