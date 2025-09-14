"use client";
import React from "react";
import Container from "@/components/Container/container";
import Image from "next/image";
import Link from "next/link";
import useMainHeader from "./useMainHeader";
import { usePathname } from "next/navigation";
import { twc } from "@/utils";

const MainHeader = () => {
  const { isScrolled, isMenuOpen, setIsMenuOpen, menuRef } = useMainHeader();
  const pathname = usePathname();

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

        {/* Hamburger Menu Button */}
        <button
          className={`${twClasses.hamburger} ${isMenuOpen ? "open" : ""} ${
            isScrolled
              ? "text-black"
              : pathname !== "/" || isMenuOpen
              ? "text-black"
              : "text-white"
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <div ref={menuRef} className={twClasses.menu_container}>
          <nav
            className={`main-header__navigation ${twClasses.navigation} ${
              isScrolled
                ? "text-black"
                : pathname !== "/"
                ? "text-black"
                : "text-white"
            }`}
          >
            <Link
              href="/about"
              className={`main-header__navigation--link ${twClasses.nav_link} ${twClasses.nav_link.hover}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/testimonials"
              className={`main-header__navigation--link ${twClasses.nav_link} ${twClasses.nav_link.hover}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="/careers"
              className={`main-header__navigation--link ${twClasses.nav_link} ${twClasses.nav_link.hover}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Careers
            </Link>
            <Link
              href="/contact-us"
              className={`main-header__navigation--link ${twClasses.nav_link} ${twClasses.nav_link.hover}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default MainHeader;

const twClasses = twc({
  header:
    "fixed top-0 left-0 w-full z-[1024] transition-all duration-300 ease-out",
  header_scrolled: "bg-white/90 backdrop-blur-sm shadow-lg",
  container: "flex justify-between items-center relative",
  logo: "flex items-center gap-4",
  logo_image: "transition-all duration-300 ease-out",
  navigation:
    "flex lg:items-center transition-all duration-300 ease-out lg:gap-10 max-lg:flex-col max-lg:w-full max-lg:pt-20",
  menu_container:
    "max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:h-screen max-lg:w-[425px] max-lg:w-full max-lg:bg-white max-lg:shadow-xl max-lg:transform max-lg:translate-x-full max-lg:z-50 max-lg:pt-8",
  hamburger:
    "max-lg:flex hidden flex-col justify-center items-center w-8 h-8 gap-1.5 z-[1025] [&.open>span:nth-child(1)]:rotate-45 [&.open>span:nth-child(1)]:translate-y-[9px] [&.open>span:nth-child(2)]:opacity-0 [&.open>span:nth-child(3)]:-rotate-45 [&.open>span:nth-child(3)]:-translate-y-[9px] [&>span]:w-6 [&>span]:h-0.5 [&>span]:bg-[currentColor] [&>span]:rounded-full [&>span]:transition-all [&>span]:duration-300",
  nav_link: {
    DEFAULT:
      "relative max-lg:block max-lg:text-black max-lg:w-full max-lg:py-4 max-lg:px-8 max-lg:text-lg max-lg:hover:bg-gray-50 transition-colors duration-200",
    hover: "hover:lg:text-primary",
  },
});
