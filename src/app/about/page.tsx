import React from "react";
import MainFooter from "@/widgets/MainFooter";
import MainHeader from "@/widgets/MainHeader";
import AboutBanner from "@/widgets/AboutBanner";
import AboutQualityWorks from "@/widgets/AboutQualityWorks";
import AboutCareers from "@/widgets/AboutCareers";
import TailoredServiceBanner from "@/widgets/TailoredServiceBanner";
import AboutBeliveSystem from "@/widgets/AboutBeliveSystem";
import AboutWideTailored from "@/widgets/AboutWideTailored";
import AboutInsights from "@/widgets/AboutInsights";
import GlobalContextProvider from "@/components/GlobalContextProvider/globalContextProvider";

const About = () => {
  return (
    <GlobalContextProvider>
      <MainHeader />
      <AboutBanner />
      <AboutQualityWorks />
      <AboutCareers />
      <AboutBeliveSystem />
      <AboutWideTailored />
      <AboutInsights />
      <TailoredServiceBanner />
      <MainFooter />
    </GlobalContextProvider>
  );
};

export default About;
