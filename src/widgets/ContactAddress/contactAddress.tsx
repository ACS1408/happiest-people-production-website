import React from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Image from "next/image";
import Icons from "@/utils/icons";
import { twc } from "@/utils";

const ContactAddress = () => {
  return (
    <section
      data-widget="contact-address"
      className={`contact-address ${twClasses.section}`}
    >
      <Container>
        <div className={`contact-address__grid ${twClasses.grid}`}>
          <figure
            className={`contact-address__image-container ${twClasses.image_container}`}
          >
            <Image
              src="/images/hpp-office.webp"
              fill
              alt="hpp office building"
              className="object-cover"
            />
          </figure>
          <div className="text-white">
            <div className="location">
              <h2 className="text-gray-400">Location Address</h2>
              <address className={`contact-adrress ${twClasses.address}`}>
                Happiest People Productions, Aloor Road,
                <br />
                Perumannu, Kechery,
                <br />
                Thrissur, Eranellur, Kerala
                <br />
                680501
              </address>

              <Button
                text="Get Direction"
                icon={<Icons.ChevronRight className="h-3 mt-px" />}
                href="https://maps.app.goo.gl/Y28CxsP2r28H2UM8A"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined-with-icon"
                color="white"
                className="mt-8 w-max rounded-full"
              />
            </div>

            <div className="email-and-phone lg:mt-16 mt-12">
              <h2 className="text-gray-400">Phone / Email</h2>
              <p className="mt-5">
                <a href="tel:09449847321" className="hover:underline">
                  09449847321
                </a>
                <span className="text-gray-400">
                  {" "}
                  ( 9 am to 5 pm, Except on Sundays )
                </span>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactAddress;

const twClasses = twc({
  section: "lg:py-32 py-16 bg-black",
  grid: "grid lg:grid-cols-2 lg:gap-[10%] gap-10 items-center",
  image_container: "relative aspect-square",
  address: "not-italic mt-5 leading-7",
});
