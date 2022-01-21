import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import Order from '../models/orderModel.js';
import ProductModel from '../models/productModel.js';
import ErrorHandler from '../utils/errorhandler.js';

//! CREATE A ORDER
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  const order = await Order.create({ shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paidAt: Date.now(), user: req.user._id });

  res.status(201).json({
    success: true,
    order
  });
});

//! GET SINGLE ORDER
export const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorHandler('Order not found with this id', 404));
  }

  res.status(200).json({
    success: true,
    order
  });
});

//! GET LOGGED IN USER ORDERS
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.user._id);
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders
  });
});

//! GET ALL ORDERS --ADMIN
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.user._id);
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach(order => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders
  });
});

//! UPDATE ORDER STATUS --ADMIN
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.user._id);
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order not found with this id', 404));
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('You have already delivered this order', 400));
  }

  order.orderItems.forEach(async o => {
    await updateStock(o.product, o.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true
  });
});

const updateStock = async (id, quantity) => {
  const product = await ProductModel.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
};

//! DELETE ORDER --ADMIN
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.user._id);
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order not found with this id', 404));
  }

  await order.remove();

  res.status(200).json({
    success: true
  });
});
