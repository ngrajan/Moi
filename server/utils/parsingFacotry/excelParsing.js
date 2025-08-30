import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
import AppError from "../appError";
XLSX.set_fs(fs);

export const excelData = (req, res, next) => {
  const fileBuffer = fs.readFileSync(req.file.path);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  req.excel = XLSX.utils.sheet_to_json(sheet); // array of objs

  if (!sheetName || !sheet) {
    return next(new AppError("Error in excel file parsing", 400));
  }
};
