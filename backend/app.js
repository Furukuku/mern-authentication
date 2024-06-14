import express from "express";
import mongoose from "mongoose";
import { PORT } from "./config.js";
import userRoute from "./routes/usersRoute.js";
import cors from "cors";
import "dotenv/config";

const app = express();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => console.log('Listening on port', PORT));
  })
  .catch(err => console.log('Connection failed:', err));

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-type', 'Authorization']
}));

app.use('/', userRoute);