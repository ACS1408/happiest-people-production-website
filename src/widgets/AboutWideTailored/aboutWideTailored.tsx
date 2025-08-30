import Container from "@/components/Container";
import { twc } from "@/utils";
import useTextSplitAnimation from "@/utils/useTextSplitAnimation";
import Image from "next/image";
import React, { useRef } from "react";

const AboutWideTailored = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  useTextSplitAnimation(titleRef, { stagger: 0, duration: 1.5 });
  useTextSplitAnimation(descRef, { stagger: 0, duration: 1.5 });

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

        <h2
          className={`about-wide-tailored__title ${twClasses.title}`}
          ref={titleRef}
        >
          wide <em className="font-medium">tailored</em>
        </h2>

        <div className={`about-wide-tailored__contents ${twClasses.contents}`}>
          <p
            className={`about-wide-tailored__description ${twClasses.description}`}
            ref={descRef}
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
  title: "mt-16 fs-title-tertiary",
  description: "mt-10 fs-para-primary max-w-[475px] ms-auto",
});
