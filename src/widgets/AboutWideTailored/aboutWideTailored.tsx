import React from "react";
import Container from "@/components/Container";
import Image from "next/image";
import { twc } from "@/utils";

const AboutWideTailored = () => {
  return (
    <section
      data-widget="about-wide-tailored"
      className={`about-wide-tailored ${twClasses.section}`}
    >
      <Container>
        <figure className={`about-wide-tailored__image ${twClasses.image}`}>
          <Image
            src="/images/mask-text.webp"
            alt="hpp text masked"
            width={1040}
            height={414}
          />
        </figure>

        <h2 className={`about-wide-tailored__title ${twClasses.title}`}>
          wide <em className="font-medium">tailored</em>
        </h2>

        <div className={`about-wide-tailored__contents ${twClasses.contents}`}>
          <p
            className={`about-wide-tailored__description ${twClasses.description}`}
          >
            Happiest people production delivers cutting-edge digital solutions
            tailored to streamline{" "}
            <em className="font-medium">operations and drive</em>
          </p>
        </div>
      </Container>
    </section>
  );
};

export default AboutWideTailored;

const twClasses = twc({
  section: "py-32 bg-tertiary",
  image: "max-w-[768px]",
  title: "mt-16 fs-title-tertiary ff-figtree font-light",
  description: "mt-10 fs-para-primary max-w-[475px] ms-auto",
});
