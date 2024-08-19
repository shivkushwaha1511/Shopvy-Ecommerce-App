import catchAsyncError from "../middleware/catchAsyncError.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { deleteFile, uploadFile } from "../utils/cloudinary.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import sendJWTToken from "../utils/sendJWTToken.js";
import crypto from "crypto";

// Register user -> "/api/register"
export const registerUser = catchAsyncError(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = await user.getJWTToken();

  res.status(201).json({
    message: "Succes",
    token,
  });
});

// Login user -> "/api/register"
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Validating user email
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Please enter valid email or password", 401));
  }

  // Validationg password
  const isPasswordMatched = await user.verifyPassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Please enter valid email or password", 401));
  }

  sendJWTToken(user, 200, res);
});

// Logout user -> "/api/logout"
export const logOutUser = catchAsyncError(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logged out",
  });
});

// forgot password -> "/api/password/forgot"
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  // Validating user email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("Please enter valid email or password", 401));
  }

  const token = await user.getResetPasswordToken();

  await user.save();

  const resetURL = `${process.env.FRONTEND_URL}/password/reset/${token}`;
  const message = getResetPasswordTemplate(user.name, resetURL);

  try {
    await sendEmail({
      toEmail: user.email,
      subject: "ShopVY password recovery",
      message,
    });

    return res.status(200).json({
      message: "Check your email box for password recovery",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return next(new ErrorHandler(error?.message, 500));
  }
});

// reset password -> "/api/password/reset/:token"
export const resetPassword = catchAsyncError(async (req, res, next) => {
  let token = req.params.token;

  token = crypto.createHash("sha256").update(token).digest("hex");

  // finding user with token
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Both passwords doesn't match", 400));
  }

  // Set nre password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res.status(201).json({ message: "Password reset successfully" });
});

// Get user profile-> "/api/me"
export const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req?.user?.id);

  return res.status(200).json({
    user,
  });
});

// Change/Update password-> "/api/password/update"
export const changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req?.user?.id).select("+password");

  const isPasswordMatched = await user.verifyPassword(req.body?.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Please enter correct old password", 400));
  }

  user.password = req.body?.password;
  await user.save();

  return res.status(201).json({
    success: true,
  });
});

// Update user profile-> "/api/me/update"
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req?.user?.id,
    { name, email },
    { new: true }
  );

  return res.status(201).json({
    user,
  });
});

// Admin get all users-> "/api/admin/users"
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  return res.status(200).json({
    users,
  });
});

// Get user details-> "/api/admin/users/:id"
export const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req?.params?.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  return res.status(200).json({
    user,
  });
});

// Admin - Update user -> "/api/admin/users/:id"
export const updateUser = catchAsyncError(async (req, res, next) => {
  const { name, email, role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role },
    { new: true }
  );

  return res.status(201).json({
    user,
  });
});

// Admin - delete user -> "/api/admin/users/:id"
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params?.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  await user.deleteOne();

  return res.status(201).json({
    success: true,
  });
});

// Upload avatar to cloudinary
export const uploadAvatar = catchAsyncError(async (req, res, next) => {
  const avatarResponse = await uploadFile(req?.body?.avatar, "shopvy/avatars");

  if (req?.user?.avatar?.url) {
    await deleteFile(req?.user?.avatar?.public_id);
  }

  const user = await User.findByIdAndUpdate(req?.user?.id, {
    avatar: avatarResponse,
  });

  return res.status(200).json({
    user,
  });
});
