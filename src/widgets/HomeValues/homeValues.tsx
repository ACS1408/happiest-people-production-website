import React from "react";
import Star from "@/icons/star.svg";
import Settings from "@/icons/settings.svg";
import Container from "@/components/Container";
import { twc } from "@/utils";

const HomeValues = () => {
  return (
    <section
      data-widget="home-values"
      className={`home-values ${twClasses.section}`}
    >
      <Container>
        <div className={`home-values__grid ${twClasses.grid}`}>
          <div className={`home-values__left ${twClasses.left}`}>
            <div className={`home-values__tag ${twClasses.tag}`}>
              Our values
            </div>
            <h2 className={`home-values__title ${twClasses.title}`}>
              Experience
              <br />
              that define
              <br />
              <em className="font-medium">happiest people</em>
            </h2>
          </div>

          <div className={`home-values__right ${twClasses.right}`}>
            <div
              className={`home-values__item  ${twClasses.value_item} ${twClasses.value_item_with_border}`}
            >
              <Star className={`home-values__icon ${twClasses.icon}`} />
              <div className={`home-values__text ${twClasses.value_text}`}>
                <h3
                  className={`home-values__text--title ${twClasses.value_title}`}
                >
                  Deep industry expertise
                </h3>
                <p
                  className={`home-values__text--desc ${twClasses.value_description}`}
                >
                  Our products are crafted with uncompromising quality, ensuring
                </p>
              </div>
            </div>

            <div className={`home-values__item ${twClasses.value_item}`}>
              <Settings className={`home-values__icon ${twClasses.icon}`} />
              <div className={`home-values__text ${twClasses.value_text}`}>
                <h3
                  className={`home-values__text--title ${twClasses.value_title}`}
                >
                  Dynamic Pricing
                </h3>
                <p
                  className={`home-values__text--desc ${twClasses.value_description}`}
                >
                  Our products are crafted with uncompromising quality,
                  ensuring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HomeValues;

const twClasses = twc({
  section: "xl:py-32 py-16 bg-primary",
  grid: "grid gap-12 lg:grid-cols-2 lg:gap-16",
  left: "space-y-4",
  tag: "font-medium text-md tracking-wide",
  title: "font-light fs-title-quaternary leading-tight",
  right: "lg:space-y-10 space-y-8",
  value_item_with_border: "flex gap-6 lg:pb-10 pb-8 border-b border-black/20",
  value_item: "flex lg:gap-12 gap-6",
  icon: "h-10",
  value_text: "space-y-2",
  value_title: "text-subtitle font-semibold",
  value_description: "text-para-secondary leading-relaxed max-w-80",
});
