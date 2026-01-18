import Container from "@/components/Container";
import { clientLogos } from "@/data/clients";
import { twc } from "@/utils";
import Image from "next/image";

const ClientsList = async () => {
  return (
    <section
      data-widget="all-clients"
      className={`all-clients ${twClasses.section}`}
    >
      <Container>
        <h2 className={`clients-list__title ${twClasses.title}`}>
          Our <em className="font-medium">Clients</em>
        </h2>
        <div className={`clients-list ${twClasses.list}`}>
          {clientLogos?.map((client, i) => {
            return (
              <div
                className={`clients-list__item ${twClasses.list_item}`}
                key={i}
              >
                <Image
                  src={client.src}
                  alt={client.name}
                  width={200}
                  height={200}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ClientsList;

const twClasses = twc({
  section: "pt-12 pb-32 mt-[122.6px] bg-white",
  title:
    "ff-figtree fs-title-tertiary font-light flex-[0_0_600px] max-w-[600px]",
  description: "fs-para-secondary max-w-[638px] ms-auto",
  list: "grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 xl:mt-16 mt-8",
  list_item:
    "border border-gray-200 flex justify-center items-center lg:p-8 p-6",
});
