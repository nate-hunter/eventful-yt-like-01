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
