import HomeBanner from "@/widgets/HomeBanner/homeBanner";
import HomeBrands from "@/widgets/HomeBrands";
import HomeClients from "@/widgets/HomeClients";
import HomeWorks from "@/widgets/HomeWorks";
import MainFooter from "@/widgets/MainFooter";
import MainHeader from "@/widgets/MainHeader";

export default function Home() {
  return (
    <>
      <MainHeader />
      <HomeBanner />
      <HomeBrands />
      <HomeWorks />
      <HomeClients />
      <MainFooter />
    </>
  );
}
