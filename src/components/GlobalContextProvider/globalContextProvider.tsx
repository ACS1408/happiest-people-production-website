import React from "react";
import SmoothScrollContext from "./SmoothScrollContext";
import PageLayoutContext from "./PageLayoutContext";
import CustomCursor from "../CustomCursor";
import ToasterProvider from "./ToasterProvider";

interface GlobalContextProps {
  children: React.ReactNode;
}

const GlobalContextProvider = ({ children }: GlobalContextProps) => {
  return (
    <PageLayoutContext>
      <SmoothScrollContext>
        <CustomCursor />
        {children}
        <ToasterProvider />
      </SmoothScrollContext>
    </PageLayoutContext>
  );
};

export default GlobalContextProvider;
