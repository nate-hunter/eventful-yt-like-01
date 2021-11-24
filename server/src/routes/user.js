import { PrismaClient } from "@prisma/client";
import express from "express";
import { protectRoute } from "../middleware/authorization";
import { getVideoViews } from "./routeHelpers";


const prisma = new PrismaClient();

function getUserRoutes() {
  const router = express.Router();

  router.get('/liked-videos', protectRoute, getLikedVideos);

  return router;
}

const getLikedVideos = async (req, res, next) => {
  let likedVideos = await prisma.videoLike.findMany({
    where: {
      userId: {
        equals: req.user.id,
      },
    },
    include: {
      video: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const likedVideoIds = likedVideos.map(video => video.videoId);

  likedVideos = await prisma.video.findMany({
    where: {
      id: {
        in: likedVideoIds,
      },
    },
    include: {
      user: true,
    },
  });

  if (!likedVideos.length === 0) {
    return res.status(200).json({ likedVideos });
  }

  likedVideos = await getVideoViews(likedVideos);

  res.status(200).json({ likedVideos });
}

export { getUserRoutes };
