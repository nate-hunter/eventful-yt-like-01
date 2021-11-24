import { PrismaClient } from "@prisma/client";
import express from "express";
import { protectRoute } from "../middleware/authorization";
import { getVideos } from "./routeHelpers";


const prisma = new PrismaClient();

function getUserRoutes() {
  const router = express.Router();

  router.get('/liked-videos', protectRoute, getUserLikedVideos);
  router.get('/history', protectRoute, getUserHistory);

  return router;
}



const getUserLikedVideos = async (req, res, next) => {
  await getVideos(prisma.videoLike, req, res);
}

const getUserHistory = async (req, res, next) => {
  await getVideos(prisma.view, req, res);
}


export { getUserRoutes };
