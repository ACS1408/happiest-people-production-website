import { useRef } from "react";
import Hls from "hls.js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const useHomeBanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
  const videoEl = videoRef.current;
  gsap.registerPlugin(ScrollTrigger, SplitText);

    const hlsUrl = "https://happiest-people-productions.s3.ap-south-1.amazonaws.com/banner-video/banner-video.m3u8";
    const mp4Url = "/videos/banner-video.mp4";

    let hls: Hls | null = null;
    let errorFallback = false;

    // Helper to safely play video after it's ready
    const tryPlay = () => {
      if (!videoEl) return;
      if (videoEl.paused) {
        videoEl.play().catch(() => {});
      }
    };

    // Clean up event listeners
    const cleanup = () => {
      if (videoEl) {
        videoEl.removeEventListener("canplay", tryPlay);
        videoEl.removeEventListener("loadeddata", tryPlay);
      }
      if (hls) hls.destroy();
    };

    if (videoEl && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(videoEl);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoEl.addEventListener("canplay", tryPlay, { once: true });
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal && !errorFallback) {
          errorFallback = true;
          hls?.destroy();
          videoEl.src = mp4Url;
          videoEl.load();
          videoEl.addEventListener("canplay", tryPlay, { once: true });
        }
      });
    } else if (videoEl && videoEl.canPlayType("application/vnd.apple.mpegurl")) {
      videoEl.src = hlsUrl;
      videoEl.load();
      videoEl.addEventListener("canplay", tryPlay, { once: true });
    } else if (videoEl) {
      videoEl.src = mp4Url;
      videoEl.load();
      videoEl.addEventListener("canplay", tryPlay, { once: true });
    }

    // Pause/resume video on scroll using ScrollTrigger
    const trigger = videoEl
      ? ScrollTrigger.create({
          trigger: videoEl,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => {
            tryPlay();
          },
          onEnterBack: () => {
            tryPlay();
          },
          onLeave: () => {
            videoEl.pause();
          },
          onLeaveBack: () => {
            videoEl.pause();
          },
        })
      : null;

    // Title reveal animation (smooth slide-up)
    let split: SplitText | null = null;
    let tl: gsap.core.Timeline | null = null;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const startTitleAnimation = () => {
      if (!titleRef.current) return;
      // Split into words only (no line wrappers/overflow clip)
      split = new SplitText(titleRef.current, {
        type: "lines",
        wordsClass: "split-word inline-block align-baseline",
      });

      // Ensure title visible (no flash) and use GPU-friendly transforms
      gsap.set(titleRef.current, { opacity: 1 });
      gsap.set(split.lines, {
        y: 20,
        opacity: 0,
        willChange: "transform, opacity",
        force3D: true,
      });

      tl = gsap.timeline();
      tl.to(split.lines, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
      });
    };

    // Track if we attached a load handler to clean up properly
    let loadHandler: (() => void) | null = null;

    if (reducedMotion) {
      if (titleRef.current) gsap.set(titleRef.current, { opacity: 1 });
    } else {
      // Run title reveal only after full page load
      const afterPageLoad = () => {
        const kickoff = () => startTitleAnimation();
        const fontsApi: any = (document as any).fonts;
        if (fontsApi && typeof fontsApi.ready?.then === "function") {
          fontsApi.ready.then(kickoff).catch(kickoff);
        } else {
          // Fallback slight delay if Font Loading API isn't available
          gsap.delayedCall(0.05, kickoff);
        }
      };

      if (typeof window !== "undefined") {
        if (document.readyState === "complete") {
          // If already loaded (e.g., client-side nav), start immediately
          afterPageLoad();
        } else {
          loadHandler = afterPageLoad;
          window.addEventListener("load", loadHandler, { once: true });
        }
      }
    }

    return () => {
      cleanup();
      // Cleanup window load handler if attached
      if (typeof window !== "undefined" && loadHandler) {
        window.removeEventListener("load", loadHandler);
      }
      if (trigger) trigger.kill();
      if (tl) tl.kill();
      split?.revert();
    };
  }, []);
  return { videoRef, titleRef };
};

export default useHomeBanner;
