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
          {/* Left Column - Image */}
          <div className="max-w-md">
            <ContactBannerIllustration />
          </div>

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
  section: "lg:pt-12 lg:pb-32 pt-8 pb-16 bg-white mt-[122.6px]",
  title: "text-4xl ff-figtree leading-tight font-light",
});
