"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/all";
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

gsap.registerPlugin(ScrollSmoother);

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Create ScrollSmoother instance
    smootherRef.current = ScrollSmoother.create({
      wrapper: wrapperRef.current!,
      content: contentRef.current!,
      smooth: 1.2,
      effects: true,
    });

    return () => {
      // Cleanup on unmount
      smootherRef.current?.kill();
      smootherRef.current = null;
    };
  }, []);

  useEffect(() => {
    // Add page-loaded class on mount
    if (mainRef.current) {
      mainRef.current.classList.add("page-loaded");
    }
  }, []);

  return (
    <main ref={mainRef}>
      <div ref={wrapperRef}>
        <div ref={contentRef}>
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
        </div>
      </div>
    </main>
  );
}
