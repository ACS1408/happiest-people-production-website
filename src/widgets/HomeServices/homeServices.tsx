import React from "react";
import Container from "@/components/Container";
import Icons from "@/utils/icons";
import { twc } from "@/utils";

const HomeServices = () => {
  return (
    <section
      data-widget="home-services"
      className={`home-services ${twClasses.section}`}
    >
      <Container>
        <div
          className={`home-services__title--wrapper ${twClasses.title_wrapper}`}
        >
          <h2 className={`home-services__title ${twClasses.title}`}>
            Our <em className="font-medium">services</em>
          </h2>
        </div>

        <div className={`home-services__content ${twClasses.grid}`}>
          {services.map(({ Icon, title, description }, index) => (
            <div
              key={index}
              className={`home-services__card ${twClasses.card}`}
            >
              <div
                className={`home-services__card--icon ${twClasses.icon_wrapper}`}
              >
                <Icon className="h-10" />
              </div>
              <h3
                className={`home-services__card--title ${twClasses.card_title}`}
              >
                {title}
              </h3>
              <p className={`home-services__card--text ${twClasses.card_text}`}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HomeServices;

const services = [
  {
    Icon: Icons.Display,
    title: "Tv, theatre commercials",
    description:
      "Our products are crafted with uncompromising quality, ensuring durability, reliability, and excellence.",
  },
  {
    Icon: Icons.PlayIcon,
    title: "Social media ads",
    description:
      "Our products are crafted with uncompromising quality, ensuring durability, reliability, and excellence.",
  },
  {
    Icon: Icons.CameraIcon,
    title: "Product shoots",
    description:
      "Our products are crafted with uncompromising quality, ensuring durability, reliability, and excellence.",
  },
];

const twClasses = twc({
  section: "bg-black xl:py-32 py-16",
  title_wrapper: "text-center xl:mb-32 mb-16",
  title:
    "fs-title-tertiary ff-figtree md:text-5xl font-light text-white max-lg:text-left",
  grid: "grid grid-cols-1 md:grid-cols-3 gap-16",
  card: "",
  icon_wrapper: "mb-6",
  card_title: "text-xl font-semibold text-white mb-4",
  card_text: "text-gray-400 text-lg leading-relaxed",
});
