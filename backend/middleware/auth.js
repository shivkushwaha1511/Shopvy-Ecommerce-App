import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHandler("Please login to access these resources", 401)
    );
  }

  const value = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(value.id);

  next();
};

export const authenticateUserRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new ErrorHandler(
          `Role (${req.user.role}) is not authorized to access this resource`,
          403
        )
      );
    }

    next();
  };
};
