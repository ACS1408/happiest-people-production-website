import React from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Image from "next/image";
import ChevronRight from "@/icons/chevron-right.svg";
import { twc } from "@/utils";

const HomeClients = () => {
  return (
    <section
      data-widget="home-clients"
      className={`home-clients ${twClasses.section}`}
    >
      <Container>
        <div className="flex items-center">
          <h2 className={`home-clients__title ${twClasses.title}`}>
            Our <em className="font-medium">Clients</em>
          </h2>
          <p className={`home-clients__description ${twClasses.description}`}>
            We value our clients as partners and are committed to delivering
            exceptional results tailored to their unique goals.
          </p>
        </div>
        <div className="home-clients__list grid grid-cols-4 mt-24">
          {[...Array(8)]?.map((_, i) => {
            return (
              <div
                className="home-clients__list--item border border-gray-200 flex justify-center items-center py-16 px-8"
                key={i}
              >
                <Image
                  src="/images/cartknitter.png"
                  alt="client logo"
                  width={200}
                  height={100}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-center mt-24">
          <Button
            text="View All"
            icon={<ChevronRight />}
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
  section: "2xl:py-48 py-32",
  title:
    "ff-figtree fs-title-secondary font-light flex-[0_0_600px] max-w-[600px]",
  description: "fs-para-secondary max-w-[638px] ms-auto",
});
