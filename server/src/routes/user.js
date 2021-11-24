import { PrismaClient } from "@prisma/client";
import express from "express";
import { protectRoute } from "../middleware/authorization";
import { getVideos, getVideoViews } from "./routeHelpers";


const prisma = new PrismaClient();

function getUserRoutes() {
  const router = express.Router();

  router.get('/liked-videos', protectRoute, getUserLikedVideos);
  router.get('/history', protectRoute, getUserHistory);
  router.get('/:userId/subscribe', protectRoute, toggleSubscribe);
  router.get('/subscriptions', protectRoute, getFeed)

  return router;
}

const getUserLikedVideos = async (req, res, next) => {
  await getVideos(prisma.videoLike, req, res);
}

const getUserHistory = async (req, res, next) => {
  await getVideos(prisma.view, req, res);
}

const toggleSubscribe = async (req, res, next) => {
  const currentUserId = req.user.id;
  const subscribeUserId = req.params.userId;

  if (currentUserId === subscribeUserId) {
    return next({
      message: 'Subscribing to your own channel is not allowed.',
      statusCode: 400,
    });
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id: subscribeUserId,
    },
  });

  if (!userExists) {
    return next({
      message: `User '${subscribeUserId}' does not exist.`,
      statusCode: 404,
    });
  }

  const isUserAlreadySubscribed = await prisma.subscription.findFirst({
    where: {
      subscriberId: {
        equals: currentUserId,
      },
      subscribedToId: {
        equals: subscribeUserId,
      },
    },
  });

  if (isUserAlreadySubscribed) {
    await prisma.subscription.delete({
      where: {
        id: isUserAlreadySubscribed.id,
      },
    });
  } else {
    await prisma.subscription.create({
      data: {
        subscriber: {
          connect: {
            id: currentUserId,
          },
        },
        subscribedTo: {
          connect: {
            id: subscribeUserId,
          },
        },
      },
    });
  }

  res.status(200).json({ message: 'Subscription handled.' })
}

const getFeed = async (req, res) => {
  const userSubscriptions = await prisma.subscription.findMany({
    where: {
      subscriberId: {
        equals: req.user.id,
      },
    },
  });

  const subscribedToIds = userSubscriptions.map(subscr => subscr.subscribedToId);

  let subscribedToVideos = await prisma.video.findMany({
    where: {
      userId: {
        in: subscribedToIds,
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (subscribedToVideos.length === 0) {
    return res.status(200).json({ feed: subscribedToVideos })
  }

  subscribedToVideos = await getVideoViews(subscribedToVideos);

  return res.status(200).json({ feed: subscribedToVideos })
}

export { getUserRoutes };
