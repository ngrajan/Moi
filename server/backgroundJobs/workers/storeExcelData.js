import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import User from "../../models/usersModel.js";
import Event from "../../models/eventModel.js";
import { Op } from "sequelize";

// ! bug - if no user in the db(deleted manually) the job is getting rejected.
// * Working fine if some changes like typing fixes this issue.
export const storeExcelDataWorker = new Worker(
  "excelDataQueue",
  async (job) => {
    const rawData = job.data.rawData;

    const seen = new Set();
    const uniqueUsers = rawData.filter((row) => {
      const key = `${row.firstName}|${row.lastName}|${row.place}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const userData = uniqueUsers.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      place: user.place,
    }));

    await User.bulkCreate(userData, { ignoreDuplicates: true });

    const usersInDB = await User.findAll({
      where: {
        [Op.or]: userData.map((user) => ({
          firstName: user.firstName,
          lastName: user.lastName,
          place: user.place,
        })),
      },
    });

    const userMap = {};
    usersInDB.forEach((user) => {
      const key = `${user.firstName}|${user.lastName}|${user.place}`;
      userMap[key] = user.id;
    });

    const eventData = rawData
      .map((row) => ({
        eventName: row.eventName,
        eventType: row.eventType,
        giver: row.giver,
        giftQuantity: row.giftQuantity,
        giftType: row.giftType,
        date: row.date,
        user_id: userMap[`${row.firstName}|${row.lastName}|${row.place}`],
      }))
      .filter((event) => event.user_id);

    await Event.bulkCreate(eventData, { validate: true });

    return { users: userData.length, events: eventData.length };
  },
  { connection }
);

storeExcelDataWorker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});
storeExcelDataWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});
