import User from "../models/usersModel.js";
import Event from "../models/eventModel.js";
import AppError from "../utils/appError.js";

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

    // 1. Create user
    const user = await User.create({ firstName, lastName, place });

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
