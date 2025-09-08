"use client";
import React from "react";
import Container from "@/components/Container";
import { twc } from "@/utils";
import CareersAccordion from "@/components/CareersAccordion";

const CurrentOpenings = () => {
  return (
    <section
      data-widget="careers-current-openings"
      className={`careers-current-openings ${twClasses.section}`}
    >
      <Container>
        <h2 className={`careers-current-openings__title ${twClasses.title}`}>
          Current <em className="font-medium">openings</em>
        </h2>
        <div className="careers-current-openings__list mt-16">
          <CareersAccordion sections={currentOpenings} />
        </div>
      </Container>
    </section>
  );
};

export default CurrentOpenings;

const currentOpenings = [
  {
    title: "Video editor",
    type: "Remote - Full time",
    richText: (
      <>
        <p>
          We are looking for a skilled{" "}
          <strong className="font-semibold">video editor</strong> to join our
          creative team. The ideal candidate will have a strong portfolio
          showcasing their editing skills and a keen eye for detail.
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>
            Expertise in Adobe Premiere Pro, Final Cut Pro, or similar tools
          </li>
          <li>Ability to work with tight deadlines</li>
          <li>Experience with color grading and sound editing</li>
        </ul>
      </>
    ),
  },
  {
    title: "Cinematographer",
    type: "Remote - Full time",
    richText: (
      <>
        <p>
          We are looking for a talented{" "}
          <strong className="font-semibold">cinematographer</strong> to join our
          team. The ideal candidate will have experience in various filming
          techniques and a strong portfolio.
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Proficiency in camera operation and lighting</li>
          <li>Creative eye for visual storytelling</li>
          <li>Experience with commercial and documentary shoots</li>
        </ul>
      </>
    ),
  },
  {
    title: "Model ( male )",
    type: "Remote - Full time",
    richText: (
      <>
        <p>
          We are looking for a{" "}
          <strong className="font-semibold">male model</strong> to join our
          team. The ideal candidate will have experience in various modeling
          techniques and a strong portfolio.
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Previous experience in fashion or commercial modeling</li>
          <li>Comfortable in front of the camera</li>
          <li>Ability to take direction and adapt to different styles</li>
        </ul>
      </>
    ),
  },
];

const twClasses = twc({
  section: "lg:py-32 py-16 bg-white",
  title: "fs-title-tertiary ff-figtree font-light text-center",
});
