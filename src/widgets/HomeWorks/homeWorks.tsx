import React, { useRef } from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Image from "next/image";
import ChevronRight from "@/icons/chevron-right.svg";
import { twc } from "@/utils";
import useTextSplitAnimation from "@/utils/useTextSplitAnimation";

const HomeWorks = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  useTextSplitAnimation(titleRef, { stagger: 0.03 });
  useTextSplitAnimation(descRef, { stagger: 0, duration: 1.5 });

  return (
    <section
      data-widget="home-works"
      className={`home-works ${twClasses.section}`}
    >
      <Container>
        <div className="flex items-center">
          <h2 className={`home-works__title ${twClasses.title}`} ref={titleRef}>
            Our <em className="font-medium">Works</em>
          </h2>
          <p className={`home-works__description ${twClasses.description}`} ref={descRef}>
            We value our clients as partners and are committed to delivering
            exceptional results tailored to their unique goals.
          </p>
        </div>
        <div className={`home-works__list ${twClasses.grid}`}>
          <div className="home-works__list--item">
            <figure className={`work-image ${twClasses.card_image}`}>
              <Image
                src="/images/work-1.jpg"
                alt=""
                fill
                className="object-cover"
              />
            </figure>
            <h3 className={`work-title ${twClasses.card_title}`}>
              Shoot for world best head phones nirvana
            </h3>
            <Button
              text="Watch Now"
              icon={<ChevronRight className="h-3 mt-px" />}
              variant="link-with-icon"
              className={`work-action ${twClasses.card_action}`}
              as={"button"}
              color="black"
            />
          </div>
          <div className="home-works__list--item">
            <figure className={`work-image ${twClasses.card_image}`}>
              <Image
                src="/images/work-2.jpg"
                alt=""
                fill
                className="object-cover"
              />
            </figure>
            <h3 className={`work-title ${twClasses.card_title}`}>
              Shoot for AKG headset world 1 brand
            </h3>
            <Button
              text="Watch Now"
              icon={<ChevronRight className="h-3 mt-px" />}
              variant="link-with-icon"
              className={`work-action ${twClasses.card_action}`}
              as={"button"}
              color="black"
            />
          </div>
        </div>
        <div className="flex justify-center mt-32">
          <Button
            text="View All"
            icon={<ChevronRight className="h-3 mt-px" />}
            variant="outlined-with-icon"
            href="/all-works"
            color="black"
          />
        </div>
      </Container>
    </section>
  );
};

export default HomeWorks;

const twClasses = twc({
  section: "2xl:py-48 py-32 bg-white",
  title:
    "ff-figtree fs-title-tertiary font-light flex-[0_0_600px] max-w-[600px]",
  description: "fs-para-secondary max-w-[638px] ms-auto",
  grid: "grid grid-cols-2 gap-4 2xl:mt-32 mt-16",
  card_image: "relative aspect-[766/430] w-full",
  card_title: "ff-manrope 2xl:mt-14 mt-8 2xl:text-2xl text-xl",
  card_action: "mt-4",
});
