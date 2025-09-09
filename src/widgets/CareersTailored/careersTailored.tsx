import React from "react";
import Container from "@/components/Container";
import { twc } from "@/utils";
import Image from "next/image";

const CareersTailored = () => {
  return (
    <section
      data-widget="careers-tailored"
      className={`careers-tailored ${twClasses.section}`}
    >
      <Container>
        <div className={`careers-tailored__wrapper ${twClasses.wrapper}`}>
          <div className={`careers-tailored__grid ${twClasses.img_grid}`}>
            {/* Top left cell */}
            <div
              className={`careers-tailored__img-cell ${twClasses.img_cell_1}`}
            >
              <Image
                src="/images/careers-tailored-1.webp"
                alt="Person working"
                fill
                className="object-cover"
              />
            </div>
            {/* Bottom right cell */}
            <div
              className={`careers-tailored__img-cell ${twClasses.img_cell_2}`}
            >
              <Image
                src="/images/careers-tailored-2.webp"
                alt="Person thinking"
                fill
                className="object-cover"
              />
            </div>
          </div>
          {/* Text content */}
          <div
            className={`careers-tailored__text-content ${twClasses.text_content}`}
          >
            <h2 className={`careers-tailored__title ${twClasses.title}`}>
              Tailores
              <br />
              <span className="font-medium">
                for{" "}
                <span
                  className={`careers-tailored__title--em-wrap ${twClasses.title_emphasize_wrap} ${twClasses.title_emphasize_wrap.after}`}
                >
                  <em
                    className={`careers-tailored__title--em ${twClasses.title_emphasize}`}
                  >
                    you
                  </em>
                </span>
                .
              </span>
            </h2>
            <p
              className={`careers-tailored__description ${twClasses.description}`}
            >
              HPP empowers businesses with complete control over their SaaS
            </p>
            {/* Bottom right image */}
            <div
              className={`careers-tailored__img-cell ${twClasses.img_cell_3}`}
            >
              <Image
                src="/images/careers-tailored-3.webp"
                alt="Person on phone"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CareersTailored;

const twClasses = twc({
  section: "lg:py-32 py-16 bg-tertiary",
  wrapper: "relative grid grid-cols-2 gap-10",
  img_grid: "grid w-max h-max",
  img_cell_1:
    "row-start-1 col-start-1 w-[150px] h-[150px] aspect-square relative",
  img_cell_2:
    "row-start-2 col-start-2 w-[300px] h-[300px] aspect-square relative",
  img_cell_3: "w-[140px] ms-auto mt-36 aspect-square relative",
  title:
    "ff-figtree font-light fs-title-quaternary leading-tight text-black mb-4",
  title_emphasize_wrap: {
    DEFAULT: "relative",
    after:
      "after:content-[''] after:block after:w-full after:h-1 after:bg-primary after:absolute after:left-0 after:bottom-0 after:-rotate-2 after:-translate-y-full",
  },
  title_emphasize: "relative z-[2]",
  text_content: "pt-5",
  description: "fs-para-secondary text-black max-w-sm mt-8",
});
