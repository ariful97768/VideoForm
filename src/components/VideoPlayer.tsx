"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
      // First click: restart from beginning and unmute
      video.currentTime = 0;
      video.muted = false;
      video.play().catch(console.error);
      setIsPlaying(true);
      onUnmute?.();
    } else {
      // Subsequent clicks: toggle play/pause
      if (video.paused) {
        video.play().catch(console.error);
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        playsInline
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />

      {/* Play/Pause Button Overlay */}
      <motion.button
        onClick={handlePlayClick}
        className="absolute group inset-0 flex items-center justify-center cursor-pointer z-1"
        aria-label={hasUserUnmuted ? (isPlaying ? "Pause video" : "Play video") : "Play video with sound"}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative rounded-full"
        >
          <div className="relative invisible group-hover:visible bg-white/95 backdrop-blur-sm rounded-full p-8 shadow-2xl transition-all duration-300">
            {!hasUserUnmuted || !isPlaying ? (
              <Play
                className="w-12 h-12 text-primary-dark transition-colors duration-300"
                fill="currentColor"
              />
            ) : (
              <Pause
                className="w-12 h-12 text-primary-dark transition-colors duration-300"
                fill="currentColor"
              />
            )}
          </div>
        </motion.div>

        {/* Hint text - only show before first unmuted play */}
        <AnimatePresence>
          {!hasUserUnmuted && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-24 text-white/90 text-sm font-sans tracking-wide"
            >
              Cliquez pour écouter avec le son
            </motion.p>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
