import React from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Image from "next/image";
import Icons from "@/utils/icons";
import { twc } from "@/utils";

const HomeClients = () => {
  return (
    <section
      data-widget="home-clients"
      className={`home-clients ${twClasses.section}`}
    >
      <Container>
        <div className="lg:flex lg:items-center">
          <h2 className={`home-clients__title ${twClasses.title}`}>
            Our <em className="font-medium">Clients</em>
          </h2>
          <p
            className={`home-clients__description max-lg:mt-4 ${twClasses.description}`}
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
            icon={<Icons.ChevronRight className="h-3 mt-px" />}
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
  section: "2xl:py-48 xl:py-32 py-16 bg-white",
  title:
    "ff-figtree fs-title-tertiary font-light flex-[0_0_600px] max-w-[600px]",
  description: "fs-para-secondary max-w-[638px] ms-auto",
  list: "grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 xl:mt-24 mt-12",
  view_all: "flex justify-center xl:mt-24 mt-16",
  list_item:
    "border border-gray-200 flex justify-center items-center lg:py-16 lg:px-8 py-12 px-6",
});
