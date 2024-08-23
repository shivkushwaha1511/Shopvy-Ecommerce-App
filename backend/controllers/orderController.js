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

const getSalesData = async (startDate, endDate) => {
  const salesData = await Order.aggregate([
    {
      // Stage 1 - Filter results
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      // Stage 2 - Group Data
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalSales: { $sum: "$totalAmount" },
        numOrders: { $sum: 1 }, // count the number of orders
      },
    },
  ]);

  let totalSales = 0;
  let totalOrders = 0;

  const salesMap = new Map();

  salesData.forEach((sale) => {
    salesMap.set(sale._id.date, {
      sales: sale.totalSales,
      numOrders: sale.numOrders,
    });
    totalSales += sale.totalSales;
    totalOrders += sale.numOrders;
  });

  const dates = getDatesBetween(startDate, endDate);

  const finalSalesData = dates.map((date) => {
    return {
      date,
      sales: (salesMap.get(date) || { sales: 0 }).sales,
      numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
    };
  });

  return { salesData: finalSalesData, totalSales, totalOrders };
};

const getDatesBetween = (startDate, endDate) => {
  const currentDate = new Date(startDate);
  const dates = [];

  while (currentDate <= new Date(endDate)) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const getSales = catchAsyncError(async (req, res, next) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    const { salesData, totalSales, totalOrders } = await getSalesData(
      startDate,
      endDate
    );

    return res.status(200).json({ salesData, totalSales, totalOrders });
  } catch (error) {
    console.log(error);

    next(error);
  }
});
