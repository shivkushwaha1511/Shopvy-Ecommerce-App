import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import APIFilters from "../utils/apiFilters.js";
import { deleteFile, uploadFile } from "../utils/cloudinary.js";

// Get all products -> "/api/product"
export const getProducts = catchAsyncError(async (req, res, next) => {
  const apiFilter = new APIFilters(Product, req.query).search().filter();

  let products = await apiFilter.query;
  const filteredProductsCount = products.length;

  const resPerPage = 8;
  apiFilter.pagination(resPerPage);
  products = await apiFilter.query.clone();

  if (!products) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    resPerPage,
    filteredProductsCount,
    products,
  });
});

// Create new product -> "/api/admin/product"
export const createProduct = catchAsyncError(async (req, res) => {
  req.body.user = req.user._id;
  const product = await Product.create(req.body);

  res.status(200).json({
    product,
  });
});

// Get product Details-> "/api/product/:id"
export const getProductDetail = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "reviews.user"
  );

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    product,
  });
});

// Get Admin all products-> "/api/admin/product"
export const getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  if (!products) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    products,
  });
});

// Update product -> "/api/product/:id"
export const updateProductDetail = catchAsyncError(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    product,
  });
});

// Delete product -> "/api/admin/products/:id"
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product?.images.forEach((img) => {
    deleteFile(img?.public_id);
  });

  await product.deleteOne();

  res.status(200).json({
    message: "Product deleted",
  });
});

// Create product review -> "api/product/reviews"
export const createReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    comment,
    rating: Number(rating),
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Checking if reviewed by user or not
  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((r) => {
      if (r.user.toString() === req.user._id.toString()) {
        r.comment = comment;
        r.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.numOfReviews;

  product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get all reviews of product -> "/api/product/reviews"
export const getAllReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate("reviews.user");

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    reviews: product.reviews,
  });
});

// Delete review of product -> "/api/admin/product/reviews"
export const deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req?.query?.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    numOfReviews === 0
      ? 0
      : reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

  product.reviews = reviews;
  product.ratings = ratings;
  product.numOfReviews = numOfReviews;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, product });
});

// User can Review => /products/can_review
export const canReview = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({
    user: req?.user?._id,
    "orderItems.product": req?.query?.productId,
  });

  if (orders.length === 0) {
    return res.status(200).json({ canReview: false });
  }

  res.status(200).json({ canReview: true });
});

// Upload Product Immages -> /products/:id/upload_images
export const uploadImages = catchAsyncError(async (req, res, next) => {
  try {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    const urls = await Promise.all(
      req?.body?.images?.map((img) => uploadFile(img, "shopvy/products"))
    );

    product?.images.push(...urls);
    await product?.save({ validateBeforeSave: false });

    res.status(201).json({
      product,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Upload Product Immages -> admin/products/:id/delte_image
export const deleteImage = catchAsyncError(async (req, res, next) => {
  try {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    const isDeleted = await deleteFile(req?.body?.imgId);

    if (isDeleted) {
      product.images = product?.images?.filter(
        (img) => img.public_id !== req.body.imgId
      );
      await product?.save({ validateBeforeSave: false });
    }

    res.status(201).json({
      product,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
