import MainFooter from "@/widgets/MainFooter";
import MainHeader from "@/widgets/MainHeader";
import TailoredServiceBanner from "@/widgets/TailoredServiceBanner";
import GlobalContextProvider from "@/components/GlobalContextProvider";
import ClientsList from "@/widgets/ClientsList/clientsList";

const Clients = () => {
  return (
    <GlobalContextProvider>
      <MainHeader />
      <ClientsList />
      <TailoredServiceBanner />
      <MainFooter />
    </GlobalContextProvider>
  );
};

export default Clients;
