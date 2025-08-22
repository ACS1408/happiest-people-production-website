"use client";
import { useEffect, useRef } from "react";
import HomeAbout from "@/widgets/HomeAbout";
import HomeBanner from "@/widgets/HomeBanner";
import HomeBrands from "@/widgets/HomeBrands";
import HomeClients from "@/widgets/HomeClients";
import HomeServices from "@/widgets/HomeServices";
import HomeTailoredServices from "@/widgets/HomeTailoredServices";
import HomeTestimonials from "@/widgets/HomeTestimonials";
import HomeValues from "@/widgets/HomeValues";
import HomeWorks from "@/widgets/HomeWorks";
import HomeWorkspace from "@/widgets/HomeWorkspace";
import MainFooter from "@/widgets/MainFooter";
import MainHeader from "@/widgets/MainHeader";
import TailoredServiceBanner from "@/widgets/TailoredServiceBanner";
import SmoothScrollContext from "@/components/SmoothScrollContext";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.classList.add("page-loaded");
    }
  }, []);

  return (
    <main className="relative" ref={mainRef}>
      <SmoothScrollContext>
        <MainHeader />
        <HomeBanner />
        <HomeBrands />
        <HomeWorks />
        <HomeAbout />
        <HomeWorkspace />
        <HomeTailoredServices />
        <HomeServices />
        <HomeClients />
        <HomeValues />
        <HomeTestimonials />
        <TailoredServiceBanner />
        <MainFooter />
      </SmoothScrollContext>
    </main>
  );
}
