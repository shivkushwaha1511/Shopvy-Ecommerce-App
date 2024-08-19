import express from "express";
import {
  getProducts,
  createProduct,
  getProductDetail,
  updateProductDetail,
  deleteProduct,
  createReview,
  getAllReviews,
  deleteReview,
  canReview,
} from "../controllers/productController.js";
import { isAuthenticated, authenticateUserRole } from "../middleware/auth.js";

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/products/:id").get(getProductDetail);
router
  .route("/admin/products")
  .post(isAuthenticated, authenticateUserRole("admin"), createProduct);
router
  .route("/admin/products/:id")
  .put(isAuthenticated, authenticateUserRole("admin"), updateProductDetail)
  .delete(isAuthenticated, authenticateUserRole("admin"), deleteProduct);

router.route("/reviews").put(isAuthenticated, createReview);

router.route("/reviews").get(getAllReviews);

router
  .route("/admin/reviews")
  .delete(isAuthenticated, authenticateUserRole("admin"), deleteReview);

router.route("/can_review").get(isAuthenticated, canReview);

export default router;
