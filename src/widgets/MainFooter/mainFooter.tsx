import React from "react";
import Container from "@/components/Container";
import Image from "next/image";

import Facebook from "@/icons/facebook.svg";
import Linkedin from "@/icons/linkedin.svg";
import Instagram from "@/icons/instagram.svg";
import Behance from "@/icons/behance.svg";
import Link from "next/link";
import { twc } from "@/utils";

const MainFooter = () => {
  return (
    <footer
      data-widget="main-footer"
      className={`main-footer ${twClasses.section}`}
    >
      <Container>
        <div className={`main-footer__main-grid ${twClasses.main_grid}`}>
          <figure>
            <Image
              src="/images/hpp-logo-with-text.svg"
              alt="happy people productions logo in black"
              width={267}
              height={195}
            />
          </figure>
          <nav className={`main-footer__nav ${twClasses.nav}`}>
            {navLinks?.map((item) => (
              <Link
                href={item?.url}
                key={item?.id}
                className={`main-footer__nav-link ${twClasses.nav_link} ${twClasses.nav_link.hover}`}
              >
                {item?.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className={`main-footer__bottom ${twClasses.footer_bottom}`}>
          <div>
            <div
              className={`main-footer__email-label ${twClasses.email_label}`}
            >
              Email
            </div>
            <a
              href="mailto:easyhydromechanical@gmail.com"
              className={`main-footer__email ${twClasses.email} ${twClasses.email.hover}`}
            >
              easyhydromechanical@gmail.com
            </a>
          </div>

          <nav className={`main-footer__socials ${twClasses.socials}`}>
            {socials?.map(({ id, icon: Icon, url }) => {
              return (
                Icon && (
                  <a
                    key={id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`main-footer__social--link ${twClasses.social_link} ${twClasses.social_link.hover} ${twClasses.social_link.group_hover}`}
                  >
                    <Icon />
                  </a>
                )
              );
            })}
          </nav>
        </div>
      </Container>
    </footer>
  );
};

export default MainFooter;

const socials = [
  {
    id: "facebook_01",
    icon: Facebook,
    url: "https://www.facebook.com",
  },
  {
    id: "linkedin_02",
    icon: Linkedin,
    url: "https://www.linkedin.com",
  },
  {
    id: "instagram_03",
    icon: Instagram,
    url: "https://www.instagram.com",
  },
  {
    id: "behance_04",
    icon: Behance,
    url: "https://www.behance.com",
  },
];

const navLinks = [
  { id: "home_01", name: "Home", url: "/" },
  { id: "services_02", name: "Services", url: "/services" },
  { id: "about_us_03", name: "About Us", url: "/about-us" },
  { id: "features_04", name: "Features", url: "/features" },
  { id: "testimonials_05", name: "Testimonials", url: "/testimonials" },
  { id: "solutions_06", name: "Solutions", url: "/solutions" },
  {
    id: "industry_vertical_07",
    name: "Industry Vertical",
    url: "/industry-vertical",
  },
  { id: "products_08", name: "Products", url: "/products" },
  { id: "blogs_09", name: "Blogs", url: "/blogs" },
  { id: "key_features_10", name: "Key Features", url: "/key-features" },
];

const twClasses = twc({
  section: "2xl:pt-32 pb-14 pt-28 pb-10",
  main_grid: "grid grid-cols-2 gap-5",
  nav: "grid grid-cols-2 gap-x-10 gap-y-3 ps-[20%]",
  nav_link: {
    DEFAULT: "transition-colors duration-300 ease-in-out",
    hover: "hover:text-primary",
  },
  email_label: "text-grey-100 text-sm font-medium",
  email: {
    DEFAULT:
      "font-semibold transition-colors duration-300 ease-in-out mt-2 inline-block",
    hover: "hover:text-primary",
  },
  footer_bottom: "flex justify-between gap-3 pt-20 flex-wrap",
  socials: "flex gap-3 group",
  social_link: {
    DEFAULT:
      "border border-grey rounded-full size-12 flex justify-center items-center transition-transform duration-300 will-change-transform",
    hover: "hover:scale-110",
    group_hover: "group-hover:scale-90",
  },
});
