import React, { useRef } from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Image from "next/image";
import ChevronRight from "@/icons/chevron-right.svg";
import { twc } from "@/utils";
import useTextSplitAnimation from "@/utils/useTextSplitAnimation";

const HomeClients = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  useTextSplitAnimation(titleRef, { stagger: 0.03 });
  useTextSplitAnimation(descRef, { stagger: 0, duration: 1.5 });

  return (
    <section
      data-widget="home-clients"
      className={`home-clients ${twClasses.section}`}
    >
      <Container>
        <div className="flex items-center">
          <h2
            className={`home-clients__title ${twClasses.title}`}
            ref={titleRef}
          >
            Our <em className="font-medium">Clients</em>
          </h2>
          <p
            className={`home-clients__description ${twClasses.description}`}
            ref={descRef}
          >
            We value our clients as partners and are committed to delivering
            exceptional results tailored to their unique goals.
          </p>
        </div>
        <div className={`home-clients__list ${twClasses.list}`}>
          {[...Array(8)]?.map((_, i) => {
            return (
              <div
                className={`home-clients__list--item ${twClasses.list_item}`}
                key={i}
              >
                <Image
                  src="/images/cartknitter.webp"
                  alt="client logo"
                  width={200}
                  height={100}
                />
              </div>
            );
          })}
        </div>
        <div className={`home-clients__view-all ${twClasses.view_all}`}>
          <Button
            text="View All"
            icon={<ChevronRight className="h-3 mt-px" />}
            variant="outlined-with-icon"
            href="/all-works"
            color="black"
          />
        </div>
      </Container>
    </section>
  );
};

export default HomeClients;

const twClasses = twc({
  section: "2xl:py-48 py-32 bg-white",
  title:
    "ff-figtree fs-title-tertiary font-light flex-[0_0_600px] max-w-[600px]",
  description: "fs-para-secondary max-w-[638px] ms-auto",
  list: "grid grid-cols-4 mt-24",
  view_all: "flex justify-center mt-24",
  list_item:
    "border border-gray-200 flex justify-center items-center py-16 px-8",
});
