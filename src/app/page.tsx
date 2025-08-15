"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ReactLenis, ReactLenisRef } from "lenis/react";
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

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<ReactLenisRef | null>(null);

  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);

    // Add page-loaded class
    if (mainRef.current) {
      mainRef.current.classList.add("page-loaded");
    }

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <main className="relative z-[2]" ref={mainRef}>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
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
    </main>
  );
}
