import React from "react";
import SmoothScrollContext from "./SmoothScrollContext";
import PageLayoutContext from "./PageLayoutContext";
import CustomCursor from "../CustomCursor";

interface GlobalContextProps {
  children: React.ReactNode;
}

const GlobalContextProvider = ({ children }: GlobalContextProps) => {
  return (
    <PageLayoutContext>
      <SmoothScrollContext>
        <CustomCursor />
        {children}
      </SmoothScrollContext>
    </PageLayoutContext>
  );
};

export default GlobalContextProvider;
