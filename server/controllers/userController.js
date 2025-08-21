import User from "../models/usersModel.js";
import AppError from "../utils/appError.js";

export default async function createUser(req, res, next) {
  try {
    const { firstName, lastName, place } = req.body;

    if (!firstName || !lastName || !place) {
      return next(new AppError("Insufficinet fields", 400));
    }

    const user = await User.create({ firstName, lastName, place });

    res.status(201).json({
      status: "success",
      data: user,
      message: "user creation success",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
}
