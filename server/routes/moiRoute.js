import express from "express";
import createUser from "../controllers/userController.js";
import { createEvent } from "../controllers/eventController.js";

const router = express.Router();

router.route("/").post(createUser, createEvent);

export default router;
