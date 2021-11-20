import { PrismaClient } from "@prisma/client";
import express from "express";


const prisma = new PrismaClient();

function getVideoRoutes() {
  const router = express.Router();

  router.get('/', getRecommendedVideos);
  router.get('/trending', getTrendingVideos);

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


export { getVideoRoutes };
