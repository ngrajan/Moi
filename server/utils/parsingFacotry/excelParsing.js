import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs/promises"; // <-- promises API
import AppError from "../appError.js";

export const excelData = async (req, res, next) => {
  try {
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
  } catch (err) {
    console.error("Excel parsing failed:", err);
    next(new AppError("Failed to read Excel file", 500));
  }
};
