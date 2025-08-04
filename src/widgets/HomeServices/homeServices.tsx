import React from "react";
import Display from "@/icons/tv-display.svg";
import PlayIcon from "@/icons/play-video.svg";
import CameraIcon from "@/icons/camera.svg";
import { twc } from "@/utils";
import Container from "@/components/Container";

const HomeServices = () => {
  return (
    <section data-widget="home-services" className={twClasses.section}>
      <Container>
        <div className={twClasses.heading_wrapper}>
          <h2 className={twClasses.heading}>
            Our <em className="font-semibold">services</em>
          </h2>
        </div>

        <div className={twClasses.grid}>
          {services.map(({ Icon, title, description }, index) => (
            <div key={index} className={twClasses.card}>
              <div className={twClasses.icon_wrapper}>
                <Icon />
              </div>
              <h3 className={twClasses.card_title}>{title}</h3>
              <p className={twClasses.card_text}>{description}</p>
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
  heading_wrapper: "text-center mb-32",
  heading: "text-4xl md:text-5xl font-light text-white",
  grid: "grid grid-cols-1 md:grid-cols-3 gap-16",
  card: "",
  icon_wrapper: "mb-6",
  card_title: "text-xl font-normal text-white mb-4",
  card_text: "text-gray-400 text-sm leading-relaxed",
});
