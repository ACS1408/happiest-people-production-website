import Container from "@/components/Container";
import IconCard from "@/components/IconCard";
import { twc } from "@/utils";
import useTextSplitAnimation from "@/utils/useTextSplitAnimation";
import React, { useRef } from "react";
import Vision from "@/icons/vision.svg";
import Mission from "@/icons/mission.svg";

const AboutBeliveSystem = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  useTextSplitAnimation(titleRef, { stagger: 0, duration: 1.5 });
  useTextSplitAnimation(descRef, { stagger: 0, duration: 1.5 });

  return (
    <section
      data-widget="about-belive-system"
      className={`about-belive-system ${twClasses.section}`}
    >
      <Container>
        <div
          className={`about-belive-system__title--wrapper ${twClasses.title_wrapper}`}
        >
          <h2
            className={`about-belive-system__title ${twClasses.title}`}
            ref={titleRef}
          >
            Our belive <em className="font-semibold">system</em>
          </h2>
          <p
            className={`home-workspace__description ${twClasses.description}`}
            ref={descRef}
          >
            Dataravn empowers businesses with complete control over their SaaS
            backups, eliminating vendor lock-in and ensuring
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
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
    icon: <Vision className="h-8" />,
    title: "Our vision",
    description:
      "Dataravn empowers businesses with complete control over their SaaS",
  },
  {
    icon: <Mission className="h-8" />,
    title: "Our mission",
    description:
      "Dataravn empowers businesses with complete control over their SaaS",
  },
];

const twClasses = twc({
  section: "py-32 bg-white",
  title_wrapper: "text-center mb-20",
  title: "fs-title-tertiary font-light text-black",
  description: "mt-10 fs-para-secondary max-w-3xl mx-auto",
});
