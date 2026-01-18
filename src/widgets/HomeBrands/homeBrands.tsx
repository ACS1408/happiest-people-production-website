import Image from "next/image";
import MarqueeSlider from "@/components/MarqueeSlider";
import { twc } from "@/utils";
import { brandLogos } from "@/data/brands";

const HomeBrands = () => {
  return (
    <section
      data-widget="home-brands"
      className={`home-brands ${twClasses.section}`}
    >
      <MarqueeSlider
        className={`home-brands__image-grid ${twClasses.image_grid}`}
      >
        {brandLogos.map((brand, index) => (
          <figure
            key={`${brand.name}-${index}`}
            className="relative aspect-square mx-2 h-28"
          >
            <Image
              src={brand.src}
              alt={`${brand.name} logo`}
              fill
              className="object-contain"
            />
          </figure>
        ))}
      </MarqueeSlider>
    </section>
  );
};

export default HomeBrands;

const twClasses = twc({
  section: "bg-primary-100 lg:py-2 py-2",
  image_grid: "items-center mix-blend-multiply",
});
