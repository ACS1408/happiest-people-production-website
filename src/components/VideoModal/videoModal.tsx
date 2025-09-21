"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
// Using inline SVG for close (no close icon in Icons set)

interface VideoModalProps {
  videoId: string; // YouTube video ID
  open: boolean;
  onClose: () => void;
  title?: string;
  allowFullscreen?: boolean;
  animationDurationMs?: number; // default 220
}

/*
  VideoModal contract:
  - Renders nothing when !open (avoids keeping iframe alive)
  - Autoplays by adding autoplay=1 & mute=1 (policy friendly) until user unmutes in player
  - Stops playback by unmounting iframe on close
  - Focus trap (simple) bringing focus to close button on open
*/

const VideoModal: React.FC<VideoModalProps> = ({
  videoId,
  open,
  onClose,
  title = "Video player",
  allowFullscreen = true,
  animationDurationMs = 220,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [render, setRender] = useState(open); // controls portal mount
  const [animState, setAnimState] = useState<"enter" | "open" | "exit">("exit");

  // Handle render lifecycle for animation
  useEffect(() => {
    if (open) {
      setRender(true);
      setAnimState('enter');
      // promote to 'open' next frame for transition
      const id = requestAnimationFrame(() => setAnimState('open'));
      return () => cancelAnimationFrame(id);
    } else if (render) {
      setAnimState('exit');
      const t = setTimeout(() => setRender(false), animationDurationMs);
      return () => clearTimeout(t);
    }
  }, [open, render, animationDurationMs]);

  // Create a container div for portal once on client
  if (typeof window !== "undefined" && !containerRef.current) {
    const div = document.createElement("div");
    div.setAttribute("id", "video-modal-root");
    containerRef.current = div;
  }

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    if (render) {
      if (!document.body.contains(el)) document.body.appendChild(el);
      // Prefer Lenis stop if available to prevent scroll; fallback to body overflow
      if (typeof window !== 'undefined' && (window as any).lenis) {
        try { (window as any).lenis.stop?.(); } catch {}
      } else {
        document.body.style.overflow = "hidden"; // prevent scroll during render
      }
      // focus after a tick once element visible
      const ft = setTimeout(() => closeBtnRef.current?.focus(), 30);
      return () => clearTimeout(ft);
    } else {
      if (document.body.contains(el)) document.body.removeChild(el);
      if (typeof window !== 'undefined' && (window as any).lenis) {
        try { (window as any).lenis.start?.(); } catch {}
      } else {
        document.body.style.overflow = "";
      }
    }
  }, [render]);

  // When exit animation begins release scroll immediately
  useEffect(() => {
    if (animState === 'exit') {
      if (typeof window !== 'undefined' && (window as any).lenis) {
        try { (window as any).lenis.start?.(); } catch {}
      } else {
        document.body.style.overflow = '';
      }
    }
  }, [animState]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
      if (e.key === "Tab" && open) {
        // very small focus trap only with close button and iframe
        const focusable: HTMLElement[] = [];
        if (closeBtnRef.current) focusable.push(closeBtnRef.current);
        const iframe = document.getElementById("video-iframe") as HTMLIFrameElement | null;
        if (iframe) focusable.push(iframe);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!render || !containerRef.current) return null;

  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0`;

  const stateAttr = animState;

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="video-modal-root"
    >
      <div
        className="video-modal-overlay"
        data-state={stateAttr}
        style={{ transitionDuration: animationDurationMs + 'ms' }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div className="video-modal-content" data-state={stateAttr} style={{ transitionDuration: animationDurationMs + 'ms' }}>
        <button
          ref={closeBtnRef}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close video"
          className="cursor-pointer absolute top-2 right-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-md bg-black/60 text-white hover:bg-black/80 focus:outline-none focus-visible:ring focus-visible:ring-white/60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <iframe
          id="video-iframe"
            title={title}
            src={src}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen={allowFullscreen}
            className="h-full w-full"
          />
      </div>
    </div>
  );

  return createPortal(modal, containerRef.current);
};

export default VideoModal;
