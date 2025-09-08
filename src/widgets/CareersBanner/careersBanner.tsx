import React from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Image from "next/image";
import Icons from "@/utils/icons";
import { twc } from "@/utils";

const CareersBanner = () => {
  return (
    <section
      data-widget="careers-banner"
      className={`careers-banner ${twClasses.section}`}
    >
      <Container>
        <h1 className="careers-banner__title fs-title-tertiary ff-figtree font-light text-center leading-tight">
          Join our
          <br />
          <em className="font-medium">creative force</em>
        </h1>
        <div className="careers-banner__button w-max mx-auto mt-12 z-[2] relative">
          <Button
            as="button"
            text="Current Openings"
            icon={<Icons.ChevronRight className="h-3 mt-px" />}
            variant="outlined-with-icon"
            color="black"
          />
        </div>
        <figure className="careers-banner__image relative aspect-[1559/842] -mt-32">
          <Image
            src="/images/careers-banner.webp"
            alt="Career Banner"
            fill
            className="object-contain"
            quality={100}
          />
        </figure>
      </Container>
    </section>
  );
};

export default CareersBanner;

const twClasses = twc({
  section: "lg:pt-12 lg:pb-32 pt-8 pb-16 bg-white mt-[122.6px]",
});
