"use client";
import React, { useEffect, useRef } from "react";
import SmoothScrollContext from "@/components/SmoothScrollContext";
import MainFooter from "@/widgets/MainFooter";
import MainHeader from "@/widgets/MainHeader";
import AboutBanner from "@/widgets/AboutBanner";
import AboutQualityWorks from "@/widgets/AboutQualityWorks";
import AboutCareers from "@/widgets/AboutCareers";
import TailoredServiceBanner from "@/widgets/TailoredServiceBanner";

const About = () => {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.classList.add("page-loaded");
    }
  }, []);

  return (
    <main className="relative z-[2]" ref={mainRef}>
      <SmoothScrollContext>
        <MainHeader />
        <AboutBanner />
        <AboutQualityWorks />
        <AboutCareers />
        <TailoredServiceBanner />
        <MainFooter />
      </SmoothScrollContext>
    </main>
  );
};

export default About;
