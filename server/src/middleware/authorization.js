import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();

export async function getAuthUser(req, res, next) { }

export async function protect(req, res, next) {
    if (!req.headers.authorization) {
        return next({
            message: 'Please log in to access this route.',
            statusCode: 401,
        });
    }

    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken.id
            },
            include: {
                videos: true
            }
        })

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
