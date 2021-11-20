import { PrismaClient } from "@prisma/client";
import express from "express";


const prisma = new PrismaClient();

function getVideoRoutes() {
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

async function getRecommendedVideos(req, res) {
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

async function getTrendingVideos(req, res) {
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

async function searchVideos(req, res, next) {
  const searchText = req.query.query;
  console.log('search text:', searchText)
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

  console.log('search:', searchResults)

  if (searchResults.length === 0) {
    return res.status(200).json({ videos: [] })
  }

  const videos = await getVideoViews(searchResults);

  res.status(200).json({ videos })
}


export { getVideoRoutes };
