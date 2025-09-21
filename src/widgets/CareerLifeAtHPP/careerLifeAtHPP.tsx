import React from "react";
import Container from "@/components/Container";
import Icons from "@/utils/icons";
import { twc } from "@/utils";

const CareerLifeAtHPP = () => {
  return (
    <section
      data-widget="careers-life-at-hpp"
      data-invert-cursor="true"
      className={`careers-life-at-hpp ${twClasses.section}`}
    >
      <Container>
        <h2 className={`careers-life-at-hpp__title ${twClasses.title}`}>
          Life @ <em className="font-medium">HPP</em>
        </h2>
        <p
          className={`careers-life-at-hpp__description ${twClasses.description}`}
        >
          What we stand for is seen in every story we tell.
          <br />
          Our culture is built on trust, teamwork, and creativity.
        </p>
        <div className={`careers-life-at-hpp__grid ${twClasses.grid}`}>
          {features.map(({ icon, title, description }, index) => {
            return (
              <div className="careers-life-at-hpp__card" key={index}>
                {icon}
                <h3
                  className={`careers-life-at-hpp__card--title ${twClasses.card_title}`}
                >
                  {title}
                </h3>
                <p
                  className={`careers-life-at-hpp__card--text ${twClasses.card_text}`}
                >
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default CareerLifeAtHPP;

const features = [
  {
    icon: <Icons.Growth className="h-8 mb-8" />,
    title: "Growth-Oriented",
    description: "Dataravn empowers businesses with complete control over",
  },
  {
    icon: <Icons.Eco className="h-8 mb-8" />,
    title: "Eco-Friendly",
    description: "Dataravn empowers businesses with complete control over",
  },
  {
    icon: <Icons.Remuneration className="h-8 mb-8" />,
    title: "Competitive remuneration",
    description: "Dataravn empowers businesses with complete control over",
  },
];

const twClasses = twc({
  section: "lg:py-32 py-16 bg-primary",
  title: "fs-title-tertiary ff-figtree font-light",
  description: "fs-para-secondary mt-12",
  grid: "grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 lg:gap-16 lg:mt-28 mt-16",
  card_title: "text-xl font-semibold mb-4",
  card_text: "text-lg leading-relaxed",
});
