import express from "express";
import createUserWithEvent from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(createUserWithEvent);

export default router;
