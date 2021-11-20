import { PrismaClient } from "@prisma/client";
import express from "express";


const prisma = new PrismaClient();

const getVideoRoutes = () => {
  const router = express.Router();

  router.get('/', getRecommendedVideos);
  router.get('/trending', getTrendingVideos);
  router.get('/search', searchVideos);

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
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  if (videos.length === 0) {
    return res.status(200).json({ videos: [] })
  }

  videos = await getVideoViews(videos);

  res.status(200).json({ videos })
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
    return res.status(200).json({ videos: [] })
  }

  videos = await getVideoViews(videos);
  console.log('videos: ', videos)
  videos.sort((a, b) => b.views - a.views);

  res.status(200).json({ videos })
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
  })

  if (searchResults.length === 0) {
    return res.status(200).json({ videos: [] })
  }

  const videos = await getVideoViews(searchResults);

  res.status(200).json({ videos })
}

const addVideo = async (req, res) => {

}


export { getVideoRoutes };
