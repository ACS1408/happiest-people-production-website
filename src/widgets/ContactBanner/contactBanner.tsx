"use client";
import React from "react";
import Container from "@/components/Container";
import ContactBannerIllustration from "@/components/AnimatedIllustrations/ContactBannerIllustration";
import ContactForm from "@/components/ContactForm";
import { twc } from "@/utils";

const ContactBanner = () => {
  return (
    <section
      data-widget="contact-banner"
      className={`contact-banner ${twClasses.section}`}
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Title */}
          <ContactBannerIllustration />

          {/* Right Column - Contact Form */}
          <div className="bg-white">
            <h2 className={`contact-banner__title ${twClasses.title}`}>
              Contact <em className="font-medium">us</em>
            </h2>
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactBanner;

const twClasses = twc({
  section: "pt-12 pb-32 bg-white mt-[122.6px]",
  title: "text-4xl leading-tight",
});
