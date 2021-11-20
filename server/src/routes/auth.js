import { PrismaClient } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";


const prisma = new PrismaClient();

const getAuthRoutes = () => {
  const router = express.Router();

  router.post('/google-login', googleLogin);

  return router;
}

// All controllers/utility functions are here -- should I put these in a controllers file/folder?
const googleLogin = async (req, res) => {
  const { username, email } = req.body;

  let user = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        username,
        email,
      }
    })
  }

  const tokenPayload = { id: user.id };
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });

  res.cookie('token', token, { httpOnly: true });
  res.status(200).send(token);

}


export { getAuthRoutes };
