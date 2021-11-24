import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getVideoViews = async (videos) => {
    for (let video of videos) {
        const views = await prisma.view.count({
            where: {
                videoId: {
                    equals: video.id,
                },
            },
        });
        video.views = views;
    }
    return videos;
}

export const getVideos = async (model, req, res) => {
    let videos = await model.findMany({
        where: {
            userId: {
                equals: req.user.id,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const likedVideoIds = videos.map(video => video.videoId);

    videos = await prisma.video.findMany({
        where: {
            id: {
                in: likedVideoIds,
            },
        },
        include: {
            user: true,
        },
    });

    if (!videos.length === 0) {
        return res.status(200).json({ videos });
    }

    videos = await getVideoViews(videos);

    res.status(200).json({ videos });
}
