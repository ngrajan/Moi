import User from "../models/demoUser.js";
import AppError from "../utils/appError.js";

export default async function createUser(req, res, next) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return next(new AppError("Insufficinet fields", 400));
    }

    const user = await User.create({ name, email });

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
