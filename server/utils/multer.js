import multer from "multer";
import path from "path";
import fs from "fs";
import AppError from "../utils/appError.js";
import { __dirname } from "./path.js";

const directory = path.join(__dirname, "../uploads/excel");

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, `${file.fieldname}-${uniqueName}`);
  },
});
// 2) validity check
const checkValidType = (file, cb) => {
  const validExt = /\.(xls|xlsx|xlsm|xlsb|csv)$/i;
  const validMimes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel.sheet.macroEnabled.12",
    "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
    "text/csv",
    "application/csv",
  ];

  const extensionName = validExt.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = validMimes.includes(file.mimetype);

  if (extensionName && mimeType) {
    cb(null, true);
  } else {
    cb(new AppError("Invalid file type", 415));
  }
};

// 3) logic implementation and export
export const uploadFile = multer({
  storage,
  limits: 50 * 1024 * 1024,
  fileFilter: (req, file, cb) => {
    checkValidType(file, cb);
  },
}).single("excelFile");
