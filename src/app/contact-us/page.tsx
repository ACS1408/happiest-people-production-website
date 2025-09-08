import React from "react";
import MainFooter from "@/widgets/MainFooter";
import MainHeader from "@/widgets/MainHeader";
import TailoredServiceBanner from "@/widgets/TailoredServiceBanner";
import ContactBanner from "@/widgets/ContactBanner";
import GlobalContextProvider from "@/components/GlobalContextProvider";
import ContactAddress from "@/widgets/ContactAddress/contactAddress";

const ContactUs = () => {
  return (
    <GlobalContextProvider>
      <MainHeader />
      <ContactBanner />
      <ContactAddress />
      <TailoredServiceBanner />
      <MainFooter />
    </GlobalContextProvider>
  );
};

export default ContactUs;
