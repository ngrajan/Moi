import express from "express";
import morgan from "morgan";
import "dotenv/config";
import AppError from "./utils/appError.js";
import { errorHandler } from "./controllers/errorControllers.js";
import dummyRoute from "./routes/dummyRoute.js";

const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/moi", dummyRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
