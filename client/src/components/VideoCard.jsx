import { id } from "date-fns/locale";
import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../styles/Avatar";
import Wrapper from "../styles/VideoCard";
import { formatCreatedAt } from "../utils/date";
import DeleteVideoDropdown from "./DeleteVideoDropdown";

const VideoCard = ({ video }) => {
  const { id, thumbnail, title, user, views, createdAt } = video;

  // console.log('video:', video);

  return (
    <Wrapper>
      <Link to={`/watch/${id}`}>
        <img
          className="thumb"
          src={thumbnail}
          alt={title}
        />
      </Link>
      <div className="video-info-container">
        <div className="channel-avatar">
          <Avatar
            style={{ marginRight: "0.8rem" }}
            src={user.avatar}
            alt={`${user.username}'s avatar`}
          />
        </div>
        <div className="video-info">
          <Link to={`/watch/${id}`}>
            <h4 className="truncate">{title}</h4>
          </Link>
          <span>
            <span className="secondary">{user.username}</span>
          </span>
          <p className="secondary leading-4">
            <span>{views} views</span> <span>•</span> <span>{formatCreatedAt(createdAt)}</span>
          </p>
        </div>
        <DeleteVideoDropdown video={video} />
      </div>
    </Wrapper>
  );
}

export default VideoCard;
