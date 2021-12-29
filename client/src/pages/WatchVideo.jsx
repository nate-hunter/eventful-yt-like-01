// @ts-nocheck
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import AddComment from "../components/AddComment";
import { DislikeIcon, LikeIcon } from "../components/Icons";
import NoResults from "../components/NoResults";
import VideoCard from "../components/VideoCard";
import VideoPlayer from "../components/VideoPlayer";
import Skeleton from "../skeletons/WatchVideoSkeleton";
import Button from "../styles/Button";
import Wrapper from "../styles/WatchVideo";
import { client, dislikeVideo, likeVideo } from "../utils/api-client";
import { formatCreatedAt } from '../utils/date.js';


const WatchVideo = () => {
  const { videoId } = useParams();
  const { data: video, isLoading: isLoadingVideo } = useQuery(['WatchVideo', videoId], () => client.get(`/videos/${videoId}`).then(resp => resp.data.video));
  const { data: nextVideos, isLoading: isLoadingNextVideos } = useQuery(['WatchVideo', 'UpNext'], () => client.get(`/videos`).then(resp => resp.data.videos))

  if (isLoadingVideo || isLoadingNextVideos) {
    return <Skeleton />
  }

  if (!isLoadingVideo && !video) {
    return (
      <NoResults
        title="Page not found"
        text="The page you are looking for was not found or it may have been removed"
      />
    );
  }

  const handleLikeVideo = (videoId) => {
    likeVideo(videoId);
  }

  const handleDislikeVideo = (videoId) => {
    console.log('watch video before:', video)

    // console.log(videoId)
    dislikeVideo(videoId);
    console.log('watch video after:', video)

  }

  return (
    <Wrapper filledLike={video && video.isLiked} filledDislike={video && video.isDisLiked}>
      <div className="video-container">
        <div className="video">
          {!isLoadingVideo && <VideoPlayer video={video} />}
        </div>

        <div className="video-info">
          <h3>{video.title}</h3>

          <div className="video-info-stats">
            <p>
              <span>{video.views} views</span> <span>•</span>{" "}
              <span>Premiered {formatCreatedAt(video.createdAt)}</span>
            </p>

            <div className="likes-dislikes flex-row">
              <p className="flex-row like">
                <LikeIcon onClick={() => handleLikeVideo(video.id)} /> <span>{video.likesCount}</span>
              </p>
              <p className="flex-row dislike" style={{ marginLeft: "1rem" }}>
                <DislikeIcon onClick={() => handleDislikeVideo(video.id)} /> <span>{video.dislikesCount}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="channel-info-description">
          <div className="channel-info-flex">
            <div className="channel-info flex-row">
              <img
                className="avatar md"
                src={video.user.avatar}
                alt={`${video.user.username} channel avatar`}
              />
              <div className="channel-info-meta">
                <h4>{video.user.username}</h4>
                <span className="secondary small">
                  {video.subscribersCount} subscribers
                </span>
              </div>
            </div>

            {!video.isUserVideo && !video.isSubscribed && <Button>Subscribe</Button>}

            {!video.isUserVideo && video.isSubscribed && <Button>Subscribed</Button>}
          </div>

          <p>{video.description}</p>
        </div>

        <AddComment video={video} />
      </div>

      <div className="related-videos">
        <h3 className="up-next">Up Next</h3>
        {nextVideos.filter(nextVideo => nextVideo.id !== video.id).slice(0, 10).map(video => (
          <VideoCard key={video.id} video={video} hideAvatar />
        ))}
      </div>
    </Wrapper>
  );
}

export default WatchVideo;
