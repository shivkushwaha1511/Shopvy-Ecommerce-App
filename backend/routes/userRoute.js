import express from "express";
import {
  changePassword,
  forgotPassword,
  getAllUsers,
  getUserProfile,
  logOutUser,
  loginUser,
  registerUser,
  resetPassword,
  updateProfile,
  getUserDetails,
  updateUser,
  deleteUser,
  uploadAvatar,
} from "../controllers/userController.js";
import { isAuthenticated, authenticateUserRole } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOutUser);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticated, changePassword);

router.route("/me").get(isAuthenticated, getUserProfile);
router.route("/me/update").put(isAuthenticated, updateProfile);
router.route("/me/upload_avatar").put(isAuthenticated, uploadAvatar);

router
  .route("/admin/users")
  .get(isAuthenticated, authenticateUserRole("admin"), getAllUsers);
router
  .route("/admin/users/:id")
  .get(isAuthenticated, authenticateUserRole("admin"), getUserDetails)
  .put(isAuthenticated, authenticateUserRole("admin"), updateUser)
  .delete(isAuthenticated, authenticateUserRole("admin"), deleteUser);

export default router;
