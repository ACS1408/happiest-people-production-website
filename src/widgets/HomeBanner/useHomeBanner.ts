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

    const hlsUrl = "/videos/banner-video/banner-video.m3u8";
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
    } else if (
      videoEl &&
      videoEl.canPlayType("application/vnd.apple.mpegurl")
    ) {
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

    return () => {
      cleanup();
      if (trigger) trigger.kill();
    };
  }, []);
  return { videoRef, titleRef };
};

export default useHomeBanner;
