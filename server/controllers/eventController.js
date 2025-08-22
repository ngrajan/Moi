import Event from "../models/eventModel.js";
import AppError from "../utils/appError.js";

export async function createEvent(req, res, next) {
  try {
    const { giver, giftQuantity, giftType, eventType, eventName } = req.body;

    if (!giver || !giftType || !giftQuantity || !eventName || !eventType) {
      return next(new AppError("Insufficient fields", 400));
    }
    const event = await Event.create({ firstName, lastName, place });

    res.status(201).json({
      status: "success",
      data: event,
      message: "user creation success",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
}
