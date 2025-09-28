import React from "react";
import SmoothScrollContext from "./SmoothScrollContext";
import PageLayoutContext from "./PageLayoutContext";
import CustomCursor from "../CustomCursor";
import ToasterProvider from "./ToasterProvider";

interface GlobalContextProps {
  children: React.ReactNode;
  contextType?: string;
}

const GlobalContextProvider = ({
  children,
  contextType,
}: GlobalContextProps) => {
  if (contextType === "admin") {
    return (
      <>
        {children}
        <ToasterProvider />
      </>
    );
  } else {
    return (
      <PageLayoutContext>
        <SmoothScrollContext>
          <CustomCursor />
          {children}
        </SmoothScrollContext>
        <ToasterProvider />
      </PageLayoutContext>
    );
  }
};

export default GlobalContextProvider;
