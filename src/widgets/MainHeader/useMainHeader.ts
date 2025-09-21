import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const useMainHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Use rAF-driven scroll state to reduce jank and align with smooth scroll
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initialize once on mount
    onScroll();
    return () => window.removeEventListener("scroll", onScroll as any);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsMenuOpen(false);
        if (menuRef.current) {
          gsap.set(menuRef.current, { clearProps: "all" });
        }
        // Ensure scrolling is enabled on desktop; prefer Lenis control if available
        if (window.lenis) {
          window.lenis?.start?.();
        } else {
          document.body.style.overflow = "";
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      // Reset on unmount
      if (window.lenis) {
        window.lenis?.start?.();
      } else {
        document.body.style.overflow = "";
      }
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 992) {
      // Toggle scroll via Lenis when available; fallback to body overflow
      if (window.lenis) {
        if (isMenuOpen) window.lenis?.stop?.();
        else window.lenis?.start?.();
      } else {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
      }

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
