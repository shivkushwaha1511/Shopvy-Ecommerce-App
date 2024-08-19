import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getOrderDetail,
  updateOrder,
} from "../controllers/orderController.js";
import { isAuthenticated, authenticateUserRole } from "../middleware/auth.js";

const router = express.Router();

router.route("/orders").post(isAuthenticated, createOrder);
router.route("/orders/").get(isAuthenticated, getMyOrders);
router.route("/orders/:id").get(isAuthenticated, getOrderDetail);

router.route("/admin/orders").get(isAuthenticated, getAllOrders);
router.route("/admin/orders/:id").put(isAuthenticated, updateOrder);
router.route("/admin/orders/:id").delete(isAuthenticated, deleteOrder);

export default router;
