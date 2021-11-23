import { PrismaClient } from "@prisma/client";
import express from "express";
import { getAuthUser, protectRoute } from "../middleware/authorization";



const prisma = new PrismaClient();

const getVideoRoutes = () => {
  const router = express.Router();

  router.get('/', getRecommendedVideos);
  router.get('/trending', getTrendingVideos);
  router.get('/search', searchVideos);
  router.post('/', protectRoute, addVideo);
  router.get('/:videoId/view', getAuthUser, addVideoView);
  router.post('/:videoId/comments', protectRoute, addComment);
  router.delete('/:videoId/comments/:commentId', protectRoute, deleteComment);

  return router;
}

const getVideoViews = async (videos) => {
  for (let video of videos) {
    const views = await prisma.view.count({
      where: {
        videoId: {
          equals: video.id
        }
      }
    });
    video.views = views;
  }
  return videos;
}

const getRecommendedVideos = async (req, res) => {
  let videos = await prisma.video.findMany({
    include: {
      user: true,
      views: true,
      comments: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  if (videos.length === 0) {
    return res.status(200).json({ videos: [] });
  }

  videos = await getVideoViews(videos);

  res.status(200).json({ videos });
}

const getTrendingVideos = async (req, res) => {
  let videos = await prisma.video.findMany({
    include: {
      user: true,
      views: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  if (videos.length === 0) {
    return res.status(200).json({ videos: [] });
  }

  videos = await getVideoViews(videos);
  console.log('videos: ', videos)
  videos.sort((a, b) => b.views - a.views);

  res.status(200).json({ videos });
}

const searchVideos = async (req, res, next) => {
  const searchText = req.query.query;

  if (!searchText) {
    return next({
      message: "Please enter something to search for.",
      statusCode: 400,
    });
  }

  const searchResults = await prisma.video.findMany({
    include: {
      user: true,
    },
    where: {
      OR: [
        {
          title: {
            contains: searchText,
            mode: 'insensitive',
          }
        },
        {
          description: {
            contains: searchText,
            mode: 'insensitive',
          }
        }
      ]
    }
  });

  if (searchResults.length === 0) {
    return res.status(200).json({ videos: [] });
  }

  const videos = await getVideoViews(searchResults);

  res.status(200).json({ videos });
}

const addVideo = async (req, res) => {
  const {
    title,
    description,
    url,
    thumbnail,
    eventDate,
    venue,
    location,
    lat,
    lon,
  } = req.body;

  const addedVideo = await prisma.video.create({
    data: {
      title,
      description,
      url,
      thumbnail,
      eventDate: new Date(eventDate),
      venue,
      location,
      lat,
      lon,
      user: {
        connect: {
          id: req.user.id,
        }
      }
    }
  });

  res.status(200).json({ video: addedVideo });
}

const addComment = async (req, res, next) => {
  const videoId = req.params.videoId
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    }
  });

  if (!video) {
    return next({
      message: `Video with ID '${videoId}' not found.`,
      statusCode: 404,
    });
  }

  const comment = await prisma.comment.create({
    data: {
      text: req.body.text,
      user: {
        connect: {
          id: req.user.id,
        }
      },
      video: {
        connect: {
          id: videoId,
        }
      }
    }
  });

  res.status(200).json({ comment });
}

const deleteComment = async (req, res, next) => {
  let deletedCommentId = req.params.commentId;

  const deletedComment = await prisma.comment.findUnique({
    where: {
      id: deletedCommentId,
    },
    select: {
      userId: true,
    }
  })

  if (!deletedComment) {
    return next({
      message: `Comment with ID '${deletedCommentId}' not found.`,
      statusCode: 404,
    });
  }

  if (deletedComment.userId !== req.user.id) {
    return next({
      message: `You must be authorized to delete the comment with ID '${deletedCommentId}'.`,
      statusCode: 401,
    });
  }

  await prisma.comment.delete({
    where: {
      id: deletedCommentId,
    }
  })

  res.status(200).json({ comment: deletedComment });
}

const addVideoView = async (req, res, next) => {
  const { videoId } = req.params;
  const viewedVideo = await prisma.video.findUnique({
    where: {
      id: videoId
    },
    include: {
      views: true,
    }
  });

  if (!viewedVideo) {
    return next({
      message: `Video with id: '${videoId}' not found.`,
      statusCode: 404,
    })
  }

  if (req.user) {
    await prisma.view.create({
      data: {
        user: {
          connect: {
            id: req.user.id,
          }
        },
        video: {
          connect: {
            id: videoId,
          }
        }
      }
    });
  } else {
    await prisma.view.create({
      data: {
        video: {
          connect: {
            id: videoId,
          }
        }
      }
    })
  }

  res.status(200).json({
    message: "Video created."
  })
}



export { getVideoRoutes };
