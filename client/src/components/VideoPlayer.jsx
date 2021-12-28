import React from "react";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import { useRef } from "react";
import { useEffect } from "react";
import { addVideoView } from "../utils/api-client";


const VideoPlayer = ({ preview, video }) => {
  // console.log(`
  //   / preview: ${preview}
  //   / video: ${video}
  // `)

  const videoRef = useRef();
  const { id, url, thumbnail } = video;

  useEffect(() => {
    const vjsPlayer = videojs(videoRef.current);

    if (!preview) {
      vjsPlayer.poster(thumbnail)
      vjsPlayer.src(url)
    }

    if (preview) {
      vjsPlayer.src({ type: 'video/mp4', src: preview });
    }

    vjsPlayer.on('ended', () => {
      addVideoView(id);
    });

    return () => {
      if (vjsPlayer) {
        vjsPlayer.dispose();
      }
    }
  }, [preview, id, url, thumbnail]);

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
