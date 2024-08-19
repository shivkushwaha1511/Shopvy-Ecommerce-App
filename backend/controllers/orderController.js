import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";

// Create new Order  =>  /api/orders/
export const createOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });

  return res.status(200).json({
    order,
  });
});

// Get user Orders  =>  /api/orders/
export const getMyOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req?.user._id });

  return res.status(200).json({
    orders,
  });
});

// Get Order detail  =>  /api/orders/:id
export const getOrderDetail = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  return res.status(200).json({
    order,
  });
});

//Admin - Get All Orders =>  /api/admin/orders/
export const getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  return res.status(200).json({
    orders,
  });
});

//Admin - Get Update Orders =>  /api/admin/orders/:id
export const updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  if (order?.orderStatus == "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  //   update product stocks
  order?.orderItems?.forEach(async (item) => {
    const product = await Product.findById(item.product.toString());

    if (!product) {
      return next(new ErrorHandler("No Product found with this ID", 404));
    }

    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  });

  order.orderStatus = req.body?.status;
  order.deliveredAt = Date.now();

  await order.save();

  return res.status(200).json({
    success: true,
  });
});

//Admin - Delete order =>  /api/admin/orders/:id
export const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  await order.deleteOne();

  return res.status(200).json({
    success: true,
  });
});
