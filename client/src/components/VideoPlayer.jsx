import React from "react";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import { useRef } from "react";
import { useEffect } from "react";


const VideoPlayer = ({ preview, url }) => {
  console.log(`
    / preview: ${preview}
    / url: ${url}
  `)

  const videoRef = useRef();

  useEffect(() => {
    const vjsPlayer = videojs(videoRef.current);

    if (preview) {
      vjsPlayer.src({ type: 'video/mp4', src: preview });
    }

    return () => {
      if (vjsPlayer) {
        vjsPlayer.dispose();
      }
    }
  }, [preview]);

  return (
    <div data-vjs-player>
      <video
        controls
        ref={videoRef}
        className="video-js vjs-fluid vjs-big-play-centered"
      ></video>
    </div>
  );
}

export default VideoPlayer;
