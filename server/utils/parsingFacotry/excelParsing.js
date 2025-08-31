import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs/promises"; // <-- promises API
import AppError from "../appError.js";
import { catchAsync } from "../catchAsync.js";

export const excelData = catchAsync(async (req, res, next) => {
  const fileBuffer = await fs.readFile(req.file.path);
  const workbook = XLSX.read(fileBuffer, {
    type: "buffer",
    raw: false,
  });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  if (!sheetName || !sheet) {
    return next(new AppError("Error in excel file parsing", 400));
  }

  const data = XLSX.utils.sheet_to_json(sheet, { defval: null });

  req.excel = data;
  next();
});
