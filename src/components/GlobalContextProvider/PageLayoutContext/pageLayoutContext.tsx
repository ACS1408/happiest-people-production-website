"use client";
import { useEffect, useRef } from "react";

interface PageLayoutContextProps {
  children: React.ReactNode;
}

const PageLayoutContext = ({ children }: PageLayoutContextProps) => {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.classList.add("page-loaded");
    }
  }, []);

  return (
    <main className="relative" ref={mainRef}>
      {children}
    </main>
  );
};

export default PageLayoutContext;
