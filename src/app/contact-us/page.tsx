"use client";
import React, { useEffect, useRef } from "react";
import SmoothScrollContext from "@/components/SmoothScrollContext";
import MainFooter from "@/widgets/MainFooter";
import MainHeader from "@/widgets/MainHeader";
import TailoredServiceBanner from "@/widgets/TailoredServiceBanner";
import ContactBanner from "@/widgets/ContactBanner";

const ContactUs = () => {
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
        <ContactBanner />
        <TailoredServiceBanner />
        <MainFooter />
      </SmoothScrollContext>
    </main>
  );
};

export default ContactUs;
