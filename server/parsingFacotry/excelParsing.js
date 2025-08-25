import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
XLSX.set_fs(fs);

export const parsedExcelData = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet); // array of objs
  return data;
};
