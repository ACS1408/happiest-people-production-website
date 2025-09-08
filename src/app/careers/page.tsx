import React from "react";
import MainFooter from "@/widgets/MainFooter";
import MainHeader from "@/widgets/MainHeader";
import CareersBanner from "@/widgets/CareersBanner/careersBanner";
import TailoredServiceBanner from "@/widgets/TailoredServiceBanner";
import GlobalContextProvider from "@/components/GlobalContextProvider";
import CareerLifeAtHPP from "@/widgets/CareerLifeAtHPP";
import CurrentOpenings from "@/widgets/CurrentOpenings/currentOpenings";
import CareersApplication from "@/widgets/CareersApplication";

const ContactUs = () => {
  return (
    <GlobalContextProvider>
      <MainHeader />
      <CareersBanner />
      <CareerLifeAtHPP />
      <CurrentOpenings />
      <CareersApplication />
      <TailoredServiceBanner />
      <MainFooter />
    </GlobalContextProvider>
  );
};

export default ContactUs;
