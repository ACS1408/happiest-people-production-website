import React from "react";
import SmoothScrollContext from "./SmoothScrollContext";
import PageLayoutContext from "./PageLayoutContext";

interface GlobalContextProps {
  children: React.ReactNode;
}

const GlobalContextProvider = ({ children }: GlobalContextProps) => {
  return (
    <PageLayoutContext>
      <SmoothScrollContext>{children}</SmoothScrollContext>
    </PageLayoutContext>
  );
};

export default GlobalContextProvider;
