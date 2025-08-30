import { CronJob } from "cron";
import path from "path";
import { promises as fs } from "fs";
import { __dirname } from "../path.js";

async function cleanOldFiles() {
  const folder = path.join(__dirname, "uploads/excel");
  const currentTime = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  // const oneMinute = 60 * 1000;

  try {
    const files = await fs.readdir(folder);
    for (const file of files) {
      const filePath = path.join(folder, file);
      const stats = await fs.stat(filePath);

      if (currentTime - stats.birthtimeMs > oneDay) {
        await fs.rm(filePath);
        console.log(`Deleted: ${filePath}`);
      }
    }
  } catch (err) {
    console.error("Error cleaning files:", err.message);
  }
}

const job = new CronJob(
  "0 0 * * * *",
  async () => {
    console.log(`[${new Date().toISOString()}] Running cleanup...`);
    await cleanOldFiles();
  },
  null,
  true,
  "Asia/Kolkata"
);

job.start();
