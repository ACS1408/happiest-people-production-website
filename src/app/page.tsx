import HomeBanner from "@/widgets/HomeBanner";
import HomeBrands from "@/widgets/HomeBrands";
import HomeClients from "@/widgets/HomeClients";
import HomeWorks from "@/widgets/HomeWorks";
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
      <HomeClients />
      <TailoredServiceBanner />
      <MainFooter />
    </>
  );
}
