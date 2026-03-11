"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  onTimeUpdate?: (currentTime: number) => void;
  hasUserUnmuted?: boolean;
  onUnmute?: () => void;
}

export default function VideoPlayer({
  videoUrl,
  onTimeUpdate,
  hasUserUnmuted = false,
  onUnmute,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasUserUnmutedRef = useRef(hasUserUnmuted);

  // Keep ref in sync without re-triggering the play effect
  useEffect(() => {
    hasUserUnmutedRef.current = hasUserUnmuted;
  }, [hasUserUnmuted]);

  // Stable callback ref for onTimeUpdate to avoid re-triggering effect
  const onTimeUpdateRef = useRef(onTimeUpdate);
  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If user has already unmuted, play with sound; otherwise muted
    video.muted = !hasUserUnmutedRef.current;
    video.play().catch(console.error);
    setIsPlaying(true);

    const handleTimeUpdate = () => {
      onTimeUpdateRef.current?.(video.currentTime);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoUrl]);

  const handlePlayClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!hasUserUnmuted) {
      // First unmute click: restart from beginning and unmute
      video.currentTime = 0;
      video.muted = false;
      video.play().catch(console.error);
      setIsPlaying(true);
      onUnmute?.();
    } else {
      // After unmute: toggle play/pause
      if (video.paused) {
        video.play().catch(console.error);
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  // On mobile: clicking the screen while playing should pause (button acts as overlay)
  // This is handled by handlePlayClick at the container level
  const handleContainerClick = (e: React.MouseEvent) => {
    // Only trigger on mobile (touch devices don't have hover)
    // and only when the video is playing after unmute
    if (hasUserUnmuted && isPlaying) {
      handlePlayClick();
    }
  };

  /**
   * Button visibility logic:
   *
   * Mobile:
   *  - Before unmute: always visible (show play button)
   *  - After unmute & playing: invisible (hidden)
   *  - After unmute & paused: always visible (show play button)
   *
   * Desktop:
   *  - Before unmute: always visible (show play button)
   *  - After unmute & playing: invisible (but visible on hover)
   *  - After unmute & paused: always visible
   */
  const showButtonMobile = !hasUserUnmuted || !isPlaying;
  // Desktop: visible if not unmuted yet, or paused, or hovering while playing
  const showButtonDesktop = !hasUserUnmuted || !isPlaying || isHovered;

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleContainerClick}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        playsInline
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />

      {/* Play/Pause Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        {/* Mobile button */}
        <AnimatePresence>
          {showButtonMobile && (
            <motion.button
              key="mobile-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                handlePlayClick();
              }}
              className="md:hidden pointer-events-auto bg-white/95 backdrop-blur-sm rounded-full p-8 shadow-2xl"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {!hasUserUnmuted || !isPlaying ? (
                <Play
                  className="w-12 h-12 text-primary-dark"
                  fill="currentColor"
                />
              ) : (
                <Pause
                  className="w-12 h-12 text-primary-dark"
                  fill="currentColor"
                />
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Desktop button */}
        <AnimatePresence>
          {showButtonDesktop && (
            <motion.button
              key="desktop-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                handlePlayClick();
              }}
              className="hidden md:flex pointer-events-auto bg-white/95 backdrop-blur-sm rounded-full p-8 shadow-2xl"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {!hasUserUnmuted || !isPlaying ? (
                <Play
                  className="w-12 h-12 text-primary-dark"
                  fill="currentColor"
                />
              ) : (
                <Pause
                  className="w-12 h-12 text-primary-dark"
                  fill="currentColor"
                />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Hint text - only show before first unmuted play */}
      <AnimatePresence>
        {!hasUserUnmuted && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-24 left-0 right-0 text-center text-white/90 text-sm font-sans tracking-wide z-10 pointer-events-none"
          >
            Cliquez pour écouter avec le son
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
