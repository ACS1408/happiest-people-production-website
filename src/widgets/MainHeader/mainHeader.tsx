"use client";

import React, { useState, useEffect } from "react";
import Container from "@/components/Container/container";
import Image from "next/image";
import Link from "next/link";
import { twc } from "@/utils";

const MainHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      data-widget="main-header"
      className={`main-header ${twClasses.header} ${
        isScrolled ? `py-4 ${twClasses.header_scrolled}` : "py-8"
      }`}
    >
      <Container className={`main-header__container ${twClasses.container}`}>
        <div className={`main-header__logo ${twClasses.logo}`}>
          <Link href="/">
            <Image
              src="/images/hpp-logo.svg"
              alt="Brand logo representing a yellow video camera icon with a smiling face inside on a dark gradient background"
              width={isScrolled ? 60 : 84}
              height={isScrolled ? 42 : 58}
              className={twClasses.logo_image}
            />
          </Link>
        </div>
        <nav
          className={`main-header__navigation ${twClasses.navigation} ${
            isScrolled ? "text-black" : "text-white"
          }`}
        >
          <Link
            href="/about-us"
            className={`main-header__navigation--link ${twClasses.nav_link} ${twClasses.nav_link.after} ${twClasses.nav_link.hover}`}
          >
            About Us
          </Link>
          <Link
            href="/testimonials"
            className={`main-header__navigation--link ${twClasses.nav_link} ${twClasses.nav_link.after} ${twClasses.nav_link.hover}`}
          >
            Testimonials
          </Link>
          <Link
            href="/careers"
            className={`main-header__navigation--link ${twClasses.nav_link} ${twClasses.nav_link.after} ${twClasses.nav_link.hover}`}
          >
            Careers
          </Link>
          <Link
            href="/contact-us"
            className={`main-header__navigation--link ${twClasses.nav_link} ${twClasses.nav_link.after} ${twClasses.nav_link.hover}`}
          >
            Contact Us
          </Link>
        </nav>
      </Container>
    </header>
  );
};

export default MainHeader;

const twClasses = twc({
  header:
    "fixed top-0 left-0 w-full z-[1024] transition-all duration-300 ease-out",
  header_scrolled: "bg-white/90 backdrop-blur-sm shadow-lg",
  container: "flex justify-between items-center",
  logo: "flex items-center gap-4",
  logo_image: "transition-all duration-300 ease-out",
  navigation: "flex items-center gap-10 transition-all duration-300 ease-out",
  nav_link: {
    DEFAULT: "relative",
    after:
      "after:content-[''] after:absolute after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-1 after:rounded-2xl after:bg-primary after:scale-x-0 after:transition-transform after:duration-300",
    hover: "hover:after:scale-x-100",
  },
});
