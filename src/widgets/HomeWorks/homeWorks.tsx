import React from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Image from "next/image";
import ChevronRight from "@/icons/chevron-right.svg";
import { twc } from "@/utils";

const HomeWorks = () => {
  return (
    <section
      data-widget="home-works"
      className={`home-works ${twClasses.section}`}
    >
      <Container>
        <div className="flex items-center">
          <h2 className={`home-works__title ${twClasses.title}`}>
            Our <em className="font-medium">Works</em>
          </h2>
          <p className={`home-works__description ${twClasses.description}`}>
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
              icon={<ChevronRight />}
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
              icon={<ChevronRight />}
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
            icon={<ChevronRight />}
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
  section: "2xl:py-48 py-32",
  title:
    "ff-figtree fs-title-secondary font-light flex-[0_0_600px] max-w-[600px]",
  description: "fs-para-secondary max-w-[638px] ms-auto",
  grid: "grid grid-cols-2 gap-4 2xl:mt-32 mt-16",
  card_image: "relative aspect-[766/430] w-full",
  card_title: "ff-manrope 2xl:mt-14 mt-8 2xl:text-2xl text-xl",
  card_action: "mt-4",
});
