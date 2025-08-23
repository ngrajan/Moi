import User from "../models/usersModel.js";
import Event from "../models/eventModel.js";
import AppError from "../utils/appError.js";
import { Op } from "sequelize";

export default async function createUserWithEvent(req, res, next) {
  try {
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
      message: "user creation success",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
}
