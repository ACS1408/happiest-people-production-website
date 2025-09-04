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

    const hlsUrl = "/videos/hls/banner-video/banner-video.m3u8";
    const mp4Url = "/videos/banner-video.mp4";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          video.src = mp4Url;
          video.play();
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.play();
    } else {
      video.src = mp4Url;
      video.play();
    }

    // Pause/resume video on scroll using ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: video,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        video.play();
      },
      onEnterBack: () => {
        video.play();
      },
      onLeave: () => {
        video.pause();
      },
      onLeaveBack: () => {
        video.pause();
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);
  return { videoRef };
};

export default useHomeBanner;
