import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const useMainHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsMenuOpen(false);
        if (menuRef.current) {
          gsap.set(menuRef.current, { clearProps: "all" });
        }
        // Reset body overflow when resizing to desktop
        document.body.style.overflow = "";
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      // Reset body overflow when component unmounts
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 992) {
      // Toggle body scroll
      document.body.style.overflow = isMenuOpen ? "hidden" : "";

      // Animate menu
      if (menuRef.current) {
        if (isMenuOpen) {
          gsap.to(menuRef.current, {
            x: "0%",
            duration: 0.5,
            ease: "power3.out",
          });
        } else {
          gsap.to(menuRef.current, {
            x: "100%",
            duration: 0.5,
            ease: "power3.in",
          });
        }
      }
    }
  }, [isMenuOpen]);

  return {
    isScrolled,
    isMenuOpen,
    setIsMenuOpen,
    menuRef,
  };
};

export default useMainHeader;
