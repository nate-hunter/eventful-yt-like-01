import express from "express";

import { getAuthRoutes } from "./auth";
import { getUserRoutes } from "./user";
import { getVideoRoutes } from "./video";

const getRoutes = () => {
  // All routes are placed on this router
  const router = express.Router();

  router.use("/auth", getAuthRoutes());
  router.use("/users", getUserRoutes());
  router.use("/videos", getVideoRoutes());

  return router;
}

export { getRoutes };
