import { twc } from "@/utils";
import React from "react";

interface IconCardProps {
  icon: any;
  title: string;
  description: string;
}

const IconCard = ({ icon, title, description }: IconCardProps) => {
  return (
    <div data-component="icon-card" className={`icon-card ${twClasses.card}`}>
      <div className={`icon-card__icon ${twClasses.icon}`}>{icon}</div>
      <h3 className={`icon-card__title ${twClasses.title}`}>{title}</h3>
      <p className={`icon-card__description ${twClasses.description}`}>
        {description}
      </p>
    </div>
  );
};

export default IconCard;

const twClasses = twc({
  card: "bg-gray-100 p-12",
  icon: "mb-4",
  title: "text-xl font-semibold mb-4",
  description: "text-lg leading-relaxed",
});
