import User from "../models/usersModel.js";
import Event from "../models/eventModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { storeExcelDataQueue } from "../backgroundJobs/queue/storeExcelData.js";

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

export const createDataFromExcel = catchAsync(async (req, res, next) => {
  const rawData = req.excel;

  const job = await storeExcelDataQueue.add("storeExcelData", { rawData });

  res.status(202).json({
    jobId: job.id,
    message: "Excel data processing has started",
  });
});
