import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

export const storeExcelDataQueue = new Queue("excelDataQueue", { connection });
