"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

type PlayerInstance = ReturnType<typeof videojs>;

export default function VideoPlayer({
  videoUrl,
}: {
  videoUrl: string;
  poster: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<PlayerInstance | null>(null);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "metadata",
        fluid: true,
        responsive: true,
      });
    }

    return () => {
      playerRef.current?.dispose();
      playerRef.current = null;
    };
  }, []);

  return (
    <div
      data-vjs-player
      className="
        relative w-full
         sm:aspect-video
        bg-black rounded-xl overflow-hidden aspect-[9/16]
        max-h-[70vh] sm:max-h-none
      "
    >
      <video
        ref={videoRef}
        className="
          video-js vjs-default-skin vjs-big-play-centered
          absolute inset-0 w-full h-full
        "
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
}
