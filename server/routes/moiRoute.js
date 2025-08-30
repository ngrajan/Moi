import express from "express";
import {
  createUserWithEvent,
  createDataFromExcel,
} from "../controllers/moiController.js";
import { uploadFile } from "../utils/multer.js";
import { excelData } from "../utils/parsingFacotry/excelParsing.js";

const router = express.Router();

router.route("/").post(createUserWithEvent);

// excel upload
router.route("/excel").post(uploadFile, excelData, createDataFromExcel);

export default router;
