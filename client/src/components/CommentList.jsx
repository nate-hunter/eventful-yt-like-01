import React from "react";
import { Link } from "react-router-dom";
import DeleteCommentDropdown from "./DeleteCommentDropdown";
import { formatCreatedAt } from '../utils/date.js';


const CommentList = ({ comments }) => {
  return (
    comments.map(comment => (
      <Comment key={comment.id} comment={comment} />
    ))
  );
}

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <Link to={`/channel/${comment.user.id}`}>
        <img src={comment.user.avatar} alt={`${comment.user.username} avatar`} />
      </Link>
      <div className="comment-info" style={{ flex: "1 1 0" }}>
        <p className="secondary">
          <span>
            <Link to={`/channel/${comment.user.id}`} className="user-channel">{comment.user.username}</Link>
          </span>
          <span style={{ marginLeft: "0.6rem" }}>{formatCreatedAt(comment.createdAt)}</span>
        </p>
        <p>{comment.text}</p>
      </div>
      <DeleteCommentDropdown comment={comment} />
    </div>
  );
}

export default CommentList;
