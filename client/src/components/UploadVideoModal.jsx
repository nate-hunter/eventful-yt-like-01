import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";
import { useAuth } from "../context/auth-context";
import Button from "../styles/Button";
import Wrapper from "../styles/UploadVideoModal";
import { addVideo } from "../utils/api-client";
import { CloseIcon } from "./Icons";
import VideoPlayer from "./VideoPlayer";

const UploadVideoModal = ({ preview, defaultTitle, url, thumbnail, closeModal }) => {
  console.log('in `upload video modal`:  preview:', preview, ' / defaultTitle:', defaultTitle, ' / url:', url, ' / thumbnail:', thumbnail)

  const user = useAuth();
  const [tab, setTab] = useState('PREVIEW');
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState('');
  const history = useHistory();
  const [openSnackbar] = useSnackbar();

  const handleTab = async () => {
    if (tab === 'PREVIEW') {
      setTab('FORM');
    } else {
      // Logic to publish the video:
      if (!title.trim() || !description.trim()) {
        return openSnackbar(<p style={{ color: '#f9f995' }}>All details are required to upload your video.</p>)
      }

      const video = {
        title,
        description,
        url,
        thumbnail,
      }

      await addVideo(video);
      closeModal();
      openSnackbar(<p style={{ color: '#c5c5fc' }} >Video published!</p>);
      history.push(`/channel/${user.id}`)
    }
  }

  return (
    <Wrapper>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-header-left">
            <CloseIcon onClick={closeModal} />
            <h3>{url ? 'Video Uploaded!' : 'Uploading video... (this could take a minute)'} </h3>
          </div>
          <div style={{ display: url ? "block" : "none" }}>
            <Button onClick={handleTab}>
              {tab === "PREVIEW" ? "Next" : "Upload"}
            </Button>
          </div>
        </div>

        {tab === "PREVIEW" && (
          <div className="tab video-preview">
            <VideoPlayer preview={preview} url={url} />
          </div>
        )}

        {tab === "FORM" && (
          <div className="tab video-form">
            <h2>Event Details</h2>
            <input
              type="text"
              placeholder="Enter your video title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Provide a description of your event."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default UploadVideoModal;
