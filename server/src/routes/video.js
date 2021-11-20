import { PrismaClient } from "@prisma/client";
import express from "express";


const prisma = new PrismaClient();

function getVideoRoutes() {
  const router = express.Router();

  router.get('/', getRecommendedVideos);

  return router;
}

async function getRecommendedVideos(req, res) {
  let videos = await prisma.video.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  if (videos.length === 0) {
    return res.status(200).json({ videos: [] })
  }

  res.status(200).json({ videos })
}


export { getVideoRoutes };
