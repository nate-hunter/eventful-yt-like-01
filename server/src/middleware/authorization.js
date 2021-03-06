import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();

export const getAuthUser = async (req, res, next) => {
    if (!req.cookies.token) {
        req.user = null;
        return next();
    }

    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
        where: {
            id: decodedToken.id,
        },
        include: {
            videos: true,
        }
    });

    req.user = user;
    next();
}

export const protectRoute = async (req, res, next) => {
    if (!req.cookies.token) {
        return next({
            message: 'Please log in to access this route.',
            statusCode: 401,
        });
    }

    try {
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken.id,
            },
            include: {
                videos: true,
            }
        });

        req.user = user;
        next();
    } catch (error) {
        console.log('\n\terror:', error);
        next({
            message: 'Please log in to access this route.',
            statusCode: 401,
        });
    }
}
