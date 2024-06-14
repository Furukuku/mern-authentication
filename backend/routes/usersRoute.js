import express from "express";
import User from "../models/User.js";
import UserController from "../controllers/UserController.js";
import jwt from "jsonwebtoken";
import 'dotenv/config';

const router = express.Router();

const checkIfAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(' ')[1];

  if (token == null) return res.status(403).json({ statusMsg: 'You are not authenticated.' });

  jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.status(403).json({ statusMsg: 'You are not authenticated.' });

    req.user = decoded.id;
    next();
  });
};

const checkIfGuest = (req, res,next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(' ')[1];

  if (token == null) return res.status(403).json({ statusMsg: 'You are not authenticated.' });

  jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      next();
    } else {
      return res.status(403).json({ statusMsg: 'You are already authenticated.' });
    }

  });
};

router.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

router.post('/create', UserController.register);

router.post('/login', UserController.login);

router.get('/home', checkIfAuth, UserController.home);

router.get('/login', checkIfGuest, (req, res) => {
  return res.status(200);
});

router.get('/register', checkIfGuest, (req, res) => {
  return res.status(200);
});

export default router;