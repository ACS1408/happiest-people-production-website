import React from "react";
import MainFooter from "@/widgets/MainFooter";
import MainHeader from "@/widgets/MainHeader";
import TailoredServiceBanner from "@/widgets/TailoredServiceBanner";
import WorksList from "@/widgets/WorksList/worksList";
import GlobalContextProvider from "@/components/GlobalContextProvider";

const About = () => {
  return (
    <GlobalContextProvider>
      <MainHeader />
      <WorksList />
      <TailoredServiceBanner />
      <MainFooter />
    </GlobalContextProvider>
  );
};

export default About;
