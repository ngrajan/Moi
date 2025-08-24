import express from "express";
import {
  createUserWithEvent,
  createDataFromExcel,
} from "../controllers/moiController.js";

const router = express.Router();

router.route("/").post(createUserWithEvent);

// excel upload
router.route("/excel").post(createDataFromExcel);

export default router;
