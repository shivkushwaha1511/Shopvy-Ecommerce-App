import ErrorHandler from "../utils/ErrorHandler.js";

export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
  };

  // Handle Invalid Mongoose ID Error
  if (err.name == "CastError") {
    const message = `Resource not found. Invalid: ${err?.path}`;
    error = new ErrorHandler(message, 404);
  }

  // Handle Duplicate email error
  if (err?.code == 11000) {
    const message = `User with entered email already exists`;
    error = new ErrorHandler(message, 404);
  }

  // Handle invalid JWT token
  if (err.name == "JsonWebTokenError") {
    const message = `Invalid JWT token, try again!!`;
    error = new ErrorHandler(message, 404);
  }

  // Handle expired JWT token
  if (err.name == "TokenExpiredError") {
    const message = `Invalid JWT token, token expired!!`;
    error = new ErrorHandler(message, 404);
  }

  // Handle Validation Error
  if (err.name == "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler(message, 404);
  }

  if (process.env.NODE_ENV == "DEVELOPMENT") {
    return res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err?.stack,
    });
  }

  if (process.env.NODE_ENV == "PRODUCTION") {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }
};
