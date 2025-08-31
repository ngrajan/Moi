import User from "../models/usersModel.js";
import Event from "../models/eventModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { Op } from "sequelize";
// import { uploadExcel } from "../utils/multer.js";
// import { parsedExcelData } from "../parsingFacotry/excelParsing.js";
export const createUserWithEvent = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    place,
    giver,
    giftQuantity,
    giftType,
    eventType,
    eventName,
  } = req.body;

  // check if user is already present
  const checkUserExists = async (obj) => {
    const isExistingUser = await User.findOne({
      where: {
        firstName: obj.firstName,
        lastName: obj.lastName,
        place: obj.place,
      },
    });
    return isExistingUser;
  };
  // 1. Create user
  let user;
  if (await checkUserExists(req.body)) {
    return next(new AppError("User already exists", 409));
  } else {
    user = await User.create({ firstName, lastName, place });
  }

  // 2. Create event with FK user_id
  const event = await Event.create({
    giver,
    giftQuantity,
    giftType,
    eventType,
    eventName,
    user_id: user.id,
  });

  if (!firstName || !lastName || !place) {
    return next(new AppError("Insufficinet fields", 400));
  }

  res.status(201).json({
    status: "success",
    data: {
      user,
      event,
    },
    message: "user and event data created",
  });
});

// ! not working as expected
export const createDataFromExcel = catchAsync(async (req, res, next) => {
  const rawData = req.excel;

  const uniqueUsers = (data) => {
    const seen = new Set();
    return data.filter((row) => {
      const key = `${row.firstName}|${row.lastName}|${row.place}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const userData = uniqueUsers(rawData).map((user) => ({
    firstName: user.firstName,
    lastName: user.lastName,
    place: user.place,
  }));

  const userKeyToIndex = {};
  userData.forEach((user, id) => {
    userKeyToIndex[`${user.firstName}|${user.lastName}|${user.place}`] = id;
  });

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
      date: row.date, // if present
      user_id: userMap[`${row.firstName}|${row.lastName}|${row.place}`],
    }))
    .filter((event) => event.user_id);

  await Event.bulkCreate(eventData, { validate: true });

  res.status(201).json({
    data: {
      user: userData,
      event: eventData,
    },
    message: "user and event data created",
  });
});

// try {
//   const excelUploader = uploadExcel();

//   excelUploader(req, res, async (err) => {
//     if (err) return next(err);

//     const excelData = parsedExcelData(req.file.path);

//     const userData = excelData;

//     // Generic field filter
//     const filterFields = (Model, data) => {
//       const validFields = Object.keys(Model.getAttributes());
//       return data.map((row) =>
//         Object.fromEntries(
//           Object.entries(row).filter(([key]) => validFields.includes(key))
//         )
//       );
//     };

//     // Clean data separately for each model
//     // const userData = filterFields(User, excelData);
//     const eventData = filterFields(Event, excelData);

//     // Insert
//     const insertUsers = await User.bulkCreate(userData, { validate: true });
//     const insertEvents = await Event.bulkCreate(eventData, {
//       validate: true,
//     });

//     res.status(201).json({
//       status: "success",
//       data: {
//         users: insertUsers,
//         events: insertEvents,
//       },
//     });
//   });
// } catch (error) {
//   res.status(500).json({
//     status: "fail",
//     data: error.message,
//   });
// }
