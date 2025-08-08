import React from "react";
import Display from "@/icons/tv-display.svg";
import PlayIcon from "@/icons/play-video.svg";
import CameraIcon from "@/icons/camera.svg";
import { twc } from "@/utils";
import Container from "@/components/Container";

const HomeServices = () => {
  return (
    <section data-widget="home-services" className={`home-services ${twClasses.section}`}>
      <Container>
        <div className={`home-services__title--wrapper ${twClasses.title_wrapper}`}>
          <h2 className={`home-services__title ${twClasses.title}`}>
            Our <em className="font-semibold">services</em>
          </h2>
        </div>

        <div className={`home-services__content ${twClasses.grid}`}>
          {services.map(({ Icon, title, description }, index) => (
            <div key={index} className={`home-services__card ${twClasses.card}`}>
              <div className={`home-services__card--icon ${twClasses.icon_wrapper}`}>
                <Icon className="h-10" />
              </div>
              <h3 className={`home-services__card--title ${twClasses.card_title}`}>{title}</h3>
              <p className={`home-services__card--text ${twClasses.card_text}`}>{description}</p>
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
    Icon: Display,
    title: "Tv, theatre commercials",
    description:
      "Our products are crafted with uncompromising quality, ensuring durability, reliability, and excellence.",
  },
  {
    Icon: PlayIcon,
    title: "Social media ads",
    description:
      "Our products are crafted with uncompromising quality, ensuring durability, reliability, and excellence.",
  },
  {
    Icon: CameraIcon,
    title: "Product shoots",
    description:
      "Our products are crafted with uncompromising quality, ensuring durability, reliability, and excellence.",
  },
];

const twClasses = twc({
  section: "bg-black py-32 px-4",
  title_wrapper: "text-center mb-32",
  title: "fs-title-tertiary md:text-5xl font-light text-white",
  grid: "grid grid-cols-1 md:grid-cols-3 gap-16",
  card: "",
  icon_wrapper: "mb-6",
  card_title: "text-xl font-normal text-white mb-4",
  card_text: "text-gray-400 text-sm leading-relaxed",
});
