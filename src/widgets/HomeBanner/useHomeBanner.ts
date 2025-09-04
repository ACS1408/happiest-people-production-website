import { useRef } from "react";
import Hls from "hls.js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useHomeBanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    const video = videoRef.current;
    if (!video) return;

    gsap.registerPlugin(ScrollTrigger);

    const hlsUrl = "https://happiest-people-productions.s3.ap-south-1.amazonaws.com/banner-video/banner-video.m3u8";
    const mp4Url = "/videos/banner-video.mp4";

    let hls: Hls | null = null;
    let errorFallback = false;

    // Helper to safely play video after it's ready
    const tryPlay = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    // Clean up event listeners
    const cleanup = () => {
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
      if (hls) hls.destroy();
    };

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.addEventListener("canplay", tryPlay, { once: true });
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal && !errorFallback) {
          errorFallback = true;
          hls?.destroy();
          video.src = mp4Url;
          video.load();
          video.addEventListener("canplay", tryPlay, { once: true });
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.load();
      video.addEventListener("canplay", tryPlay, { once: true });
    } else {
      video.src = mp4Url;
      video.load();
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    // Pause/resume video on scroll using ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: video,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        tryPlay();
      },
      onEnterBack: () => {
        tryPlay();
      },
      onLeave: () => {
        video.pause();
      },
      onLeaveBack: () => {
        video.pause();
      },
    });

    return () => {
      cleanup();
      trigger.kill();
    };
  }, []);
  return { videoRef };
};

export default useHomeBanner;
