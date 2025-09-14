import React from "react";
import Container from "@/components/Container";
import IconCard from "@/components/IconCard";
import Icons from "@/utils/icons";
import { twc } from "@/utils";

const AboutBeliveSystem = () => {
  return (
    <section
      data-widget="about-belive-system"
      className={`about-belive-system ${twClasses.section}`}
    >
      <Container>
        <div
          className={`about-belive-system__title--wrapper ${twClasses.title_wrapper}`}
        >
          <h2 className={`about-belive-system__title ${twClasses.title}`}>
            Our belive <em className="font-medium">system</em>
          </h2>
          <p
            className={`about-belive-system__description ${twClasses.description}`}
          >
            Dataravn empowers businesses with complete control over their SaaS
            backups, eliminating vendor lock-in and ensuring
          </p>
        </div>
        <div className={`about-belive-system__cards ${twClasses.cards}`}>
          {cardData.map(({ icon, title, description }, index) => {
            return (
              <IconCard
                key={index}
                icon={icon}
                title={title}
                description={description}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default AboutBeliveSystem;

const cardData = [
  {
    icon: <Icons.Vision className="h-8" />,
    title: "Our vision",
    description:
      "Dataravn empowers businesses with complete control over their SaaS",
  },
  {
    icon: <Icons.Mission className="h-8" />,
    title: "Our mission",
    description:
      "Dataravn empowers businesses with complete control over their SaaS",
  },
];

const twClasses = twc({
  section: "lg:py-32 py-16 bg-white",
  title_wrapper: "text-center lg:mb-20 mb-16",
  title: "fs-title-tertiary ff-figtree font-light text-black",
  description: "mt-10 fs-para-secondary max-w-3xl mx-auto",
  cards: "grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto",
});
