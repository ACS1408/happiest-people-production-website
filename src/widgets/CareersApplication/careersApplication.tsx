"use client";
import React from "react";
import Container from "@/components/Container/container";
import CareersApplicationForm from "@/components/CareersApplicationForm";
import { twc } from "@/utils";

const CareersApplication = () => {
  return (
    <section
      data-widget="careers-application"
      className={`careers-application ${twClasses.section}`}
    >
      <Container>
        <div className="grid xl:grid-cols-2">
          <div className="careers-application__left">
            <h2 className="careers-application__title fs-title-quaternary leading-tight ff-figtree font-light text-white max-w-sm">
              Let&apos;s make <em className="font-medium">together</em>
            </h2>
            <p className="careers-application__description text-gray-400 text-lg leading-relaxed max-w-2xs mt-8">
              Thank you for your interest in HPP. We look forward to learning
              more{" "}
            </p>
          </div>
          <div className="careers-application__right">
            <CareersApplicationForm />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CareersApplication;

const twClasses = twc({
  section: "lg:py-32 py-16 bg-black",
});
