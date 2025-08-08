import HomeAbout from "@/widgets/HomeAbout";
import HomeBanner from "@/widgets/HomeBanner";
import HomeBrands from "@/widgets/HomeBrands";
import HomeClients from "@/widgets/HomeClients";
import HomeServices from "@/widgets/HomeServices";
import HomeTailoredServices from "@/widgets/HomeTailoredServices";
import HomeTestimonials from "@/widgets/HomeTestimonials";
import HomeValues from "@/widgets/HomeValues";
import HomeWorks from "@/widgets/HomeWorks";
import HomeWorkspace from "@/widgets/HomeWorkspace";
import MainFooter from "@/widgets/MainFooter";
import MainHeader from "@/widgets/MainHeader";
import TailoredServiceBanner from "@/widgets/TailoredServiceBanner";

export default function Home() {
  return (
    <>
      <MainHeader />
      <HomeBanner />
      <HomeBrands />
      <HomeWorks />
      <HomeAbout />
      <HomeWorkspace />
      <HomeTailoredServices />
      <HomeServices />
      <HomeClients />
      <HomeValues />
      <HomeTestimonials />
      <TailoredServiceBanner />
      <MainFooter />
    </>
  );
}
