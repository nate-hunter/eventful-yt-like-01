import path from "path";
import React, { useState } from "react";
import { useSnackbar } from "react-simple-snackbar";
import { uploadMedia } from "../utils/upload-media";
import { UploadIcon } from "./Icons";
import UploadVideoModal from "./UploadVideoModal";


const VIDEO_SIZE_LIMIT = 10;

const UploadVideo = () => {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState('');
  const [defaultTitle, setDefaultTitle] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [openSnackbar, closeSnackbar] = useSnackbar();

  const closeModal = () => setShowModal(false);

  const handleVideoUpload = async (e) => {
    e.persist();
    const file = e.target.files[0];

    // Which of the following is preferable to use? Any differences/tradeoffs?
    // const title = file.name.replace('.mp4', '');
    const title = path.basename(file.name, path.extname(file.name));
    setDefaultTitle(title);

    if (file) {
      const fileSize = file.size / 1000000;

      if (fileSize > VIDEO_SIZE_LIMIT) {
        return openSnackbar(
          <div style={{ color: '#f9f995' }}>
            <p>The uploaded file is too big.</p>
            <p>Your video should be less than <span style={{ color: '#c5c5fc' }}>{VIDEO_SIZE_LIMIT} MB</span>.</p>
          </div>
        );
      }

      setShowModal(true);

      const previewVideo = URL.createObjectURL(file);
      // console.log('preview video:', previewVideo);
      setPreview(previewVideo);

      const url = await uploadMedia({
        type: "video",
        file,
        preset: "eventful"
      });



      const extension = path.extname(url);
      setUrl(url);
      setThumbnail(url.replace(extension, '.jpg'));  // Replaces the video's .mp4 extension into .jpg to act as an image
      e.target.value = '';  // Clears value from <input>
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
      {showModal && <UploadVideoModal preview={preview} defaultTitle={defaultTitle} url={url} thumbnail={thumbnail} closeModal={closeModal} />}
    </div>
  );
}

export default UploadVideo;
