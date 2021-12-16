import React from "react";
import { uploadMedia } from "../utils/upload-media";
import { UploadIcon } from "./Icons";

const UploadVideo = () => {

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const url = await uploadMedia({
        type: "video",
        file,
        preset: "eventful"
      });
    }
  }

  return (
    <div>
      <label htmlFor="video-upload">
        <UploadIcon />
      </label>
      <input
        style={{ display: "none" }}
        id="video-upload"
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
      />
    </div>
  );
}

export default UploadVideo;
