import React from "react";
import { unstable_noStore as noStore } from "next/cache"; // ensure dynamic fetch (Next 13/14 compatibility)
import Container from "@/components/Container";
import ImageCard from "@/components/ImageCard";
import { twc } from "@/utils";
import { getPublishedWorks } from "@/lib/repositories/workRepository";

// Server component: directly reads from the JSON store (no caching)
export const dynamic = "force-dynamic"; // hint to Next.js not to prerender statically

const WorksList = async () => {
  // Prevent Next.js from caching this server component between requests
  try { noStore(); } catch (_) { /* ignore if not supported */ }
  const works = await getPublishedWorks();
  return (
    <section data-widget="works-list" className={`works-list ${twClasses.section}`}>
      <Container>
        <h2 className={`works-list__title ${twClasses.title}`}>
          Our <em className="font-medium">Works</em>
        </h2>
        <div className={`works-list__items ${twClasses.grid}`}>
          {works.map((work) => (
            <ImageCard key={work.id} title={work.title} image={work.image} videoId={work.videoId} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default WorksList;

const twClasses = twc({
  section: "pt-12 pb-32 mt-[122.6px] bg-white",
  title: "ff-figtree fs-title-tertiary font-light",
  grid: "grid md:grid-cols-2 md:gap-x-4 gap-x-10 md:gap-y-12 gap-y-8 2xl:mt-32 mt-16",
});
