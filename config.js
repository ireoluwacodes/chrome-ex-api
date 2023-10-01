import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Router } from "./route.js";
import { errHandler, notFound } from "./middleware.js";
import morgan from "morgan";

dotenv.config();

mongoose.Promise = global.Promise;

const selectDB = () => {
  if (process.env.NODE_ENV == "production") {
    return process.env.MONGO_URI;
  }
  return process.env.LOCAL_MONGO_URL;
};

export const connectDB = async () => {
  let url = selectDB();
  let connect = await mongoose.connect(url);
  console.log(`Database connected successfully to ${connect.connection.host} `);
};

export const app = express();

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

app.use(Router);

app.use(notFound);
app.use(errHandler);
