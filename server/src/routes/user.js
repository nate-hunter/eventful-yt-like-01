import { PrismaClient } from "@prisma/client";
import express from "express";
import { getAuthUser, protectRoute } from "../middleware/authorization";
import { getVideos, getVideoViews } from "./routeHelpers";


const prisma = new PrismaClient();

function getUserRoutes() {
  const router = express.Router();

  router.get('/', protectRoute, getRecommendedChannels);
  router.get('/liked-videos', protectRoute, getUserLikedVideos);
  router.get('/history', protectRoute, getUserHistory);
  router.get('/:userId', getAuthUser, getProfile);
  router.get('/:userId/subscribe', protectRoute, toggleSubscribe);
  router.get('/subscriptions', protectRoute, getSubscriptionFeed);
  router.get('/search', getAuthUser, searchUser);

  return router;
}

const getRecommendedChannels = async (req, res) => {
  const recommendedChannels = await prisma.user.findMany({
    where: {
      id: {
        not: req.user.id,
      },
    },
    take: 10,
  });

  if (recommendedChannels.length === 0) {
    return res.status(200).json({ channels: recommendedChannels })
  }

  for (let channel of recommendedChannels) {
    const subscriberCount = await prisma.subscription.count({
      where: {
        subscribedToId: {
          equals: channel.id,
        },
      },
    });

    const videoCount = await prisma.video.count({
      where: {
        userId: {
          equals: channel.id,
        },
      },
    });

    const isSubscribedToChannel = await prisma.subscription.findFirst({
      where: {
        AND: {
          subscriberId: {
            equals: req.user.id,
          },
          subscribedToId: {
            equals: channel.id,
          },
        },
      },
    });

    channel.subscriberCount = subscriberCount;
    channel.videoCount = videoCount;
    channel.isSubscribedToChannel = !!isSubscribedToChannel;
  }

  res.status(200).json({ channels: recommendedChannels });
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

const getSubscriptionFeed = async (req, res) => {
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

const searchUser = async (req, res, next) => {
  const searchText = req.query.query;

  if (!searchText) {
    return next({
      message: "Please enter a username to search for.",
      statusCode: 400,
    });
  }

  const foundUsers = await prisma.user.findMany({
    where: {
      username: {
        contains: searchText,
        mode: 'insensitive',
      },
    },
  });

  if (foundUsers.length === 0) {
    return res.status(200).json({ users: [] });
  }

  for (let user of foundUsers) {
    const subscriberCount = await prisma.subscription.count({
      where: {
        subscribedToId: {
          equals: user.id,
        },
      },
    });

    const videoCount = await prisma.video.count({
      where: {
        userId: {
          equals: user.id,
        },
      },
    });

    let isCurrentUser = false;
    let isSubscribedToUser = false;

    if (req.user) {
      isCurrentUser = req.user.id === user.id;
      isSubscribedToUser = await prisma.subscription.findFirst({
        where: {
          AND: {
            subscriberId: {
              equals: req.user.id,
            },
            subscribedToId: {
              equals: user.id,
            },
          },
        },
      });
    }

    user.subscriberCount = subscriberCount;
    user.videoCountCount = videoCount;
    user.isCurrentUser = isCurrentUser;
    user.isSubscribedToUser = !!isSubscribedToUser;
  }

  res.status(200).json({ users: foundUsers });
}

const getProfile = async (req, res, next) => {
  const currentUserId = req.user.id;
  const searchedUserId = req.params.userId;

  const searchedUser = await prisma.user.findUnique({
    where: {
      id: searchedUserId,
    },
  });

  if (!searchedUser) {
    return next({
      message: `User '${searchedUserId}' does not exist.`,
      statusCode: 404,
    });
  }

  const subscriberCount = await prisma.subscription.count({
    where: {
      subscribedToId: {
        equals: searchedUser.id,
      },
    },
  });

  let isCurrentUser = false;
  let isSubscribedToUser = false;

  if (req.user) {
    isCurrentUser = currentUserId === searchedUser.id;
    isSubscribedToUser = await prisma.subscription.findFirst({
      where: {
        AND: {
          subscriberId: {
            equals: currentUserId,
          },
          subscribedToId: {
            equals: searchedUser.id,
          },
        },
      },
    });
    // user.subscriberCount = subscriberCount;
    // user.videoCountCount = videoCount;
    // user.isCurrentUser = isCurrentUser;
    // user.isSubscribedToUser = !!isSubscribedToUser;
  }
  const searchedUserSubscriptions = await prisma.subscription.findMany({
    where: {
      subscriberId: {
        equals: searchedUser.id,
      },
    },
  });

  const subscribedToIds = searchedUserSubscriptions.map(subscr => subscr.subscribedToId);

  const searchedUserChannels = await prisma.user.findMany({
    where: {
      id: {
        in: subscribedToIds,
      },
    },
  });

  for (let channel of searchedUserChannels) {
    const subscriberCount = await prisma.subscription.count({
      where: {
        subscribedToId: {
          equals: channel.id,
        },
      },
    });
    channel.subscriberCount = subscriberCount;
  }

  const searchedUserVideos = await prisma.video.findMany({
    where: {
      userId: {
        equals: searchedUser.id,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  searchedUser.isSubscribedToUser = !!isSubscribedToUser;
  searchedUser.isCurrentUser = isCurrentUser;
  searchedUser.subscriberCount = subscriberCount;
  searchedUser.searchedUserChannels = searchedUserChannels;
  searchedUser.searchedUserVideos = searchedUserVideos;


  res.status(200).json({ user: searchedUser });
}

export { getUserRoutes };
