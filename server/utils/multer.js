import multer from "multer";
import path from "path";
import fs from "fs";
import AppError from "../utils/appError.js";
import { __dirname } from "./path.js";

export const uploadExcel = () => {
  // 1)store the file in destination
  const uploadDirectory = path.join(__dirname, "../uploads/excel");
  // console.log({ uploadDirectory });
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
      cb(null, `${file.fieldname}-${uniqueName}`);
    },
  });
  // 2) validate the file type function
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

  // 3) save the file
  return multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      checkValidType(file, cb);
    },
  }).single("excelFile");
};
