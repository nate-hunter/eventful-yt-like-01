import { PrismaClient } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";
import { protectRoute } from "../middleware/authorization";


const prisma = new PrismaClient();

const getAuthRoutes = () => {
  const router = express.Router();

  router.post('/google-login', googleLogin);
  router.get('/me', protectRoute, validateMe);
  router.get('/signout', signout);

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

const validateMe = async (req, res) => {
  console.log('user:', req.user)
  res.status(200).json({ user: req.user })
}

const signout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    message: 'Current user logged out.'
  })
}

export { getAuthRoutes };
