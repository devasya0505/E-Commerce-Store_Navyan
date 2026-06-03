import asyncHandler from "express-async-handler";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const shippingFee = subtotal > 0 && subtotal < 500 ? 49 : 0;
  const total = Number((subtotal + tax + shippingFee).toFixed(2));

  return { subtotal, tax, shippingFee, total };
};

const createTransactionId = () => `SIM-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = "COD" } = req.body;

  if (!shippingAddress) {
    res.status(400);
    throw new Error("Shipping address is required");
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  const orderItems = [];

  for (const item of cart.items) {
    if (!item.product) {
      continue;
    }

    if (item.product.stock < item.quantity) {
      res.status(400);
      throw new Error(`${item.product.name} does not have enough stock`);
    }

    orderItems.push({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity
    });
  }

  if (orderItems.length === 0) {
    res.status(400);
    throw new Error("No valid cart items found");
  }

  const totals = calculateTotals(orderItems);
  const isPaid = paymentMethod !== "COD";

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    payment: {
      method: paymentMethod,
      status: isPaid ? "Paid" : "Pending",
      transactionId: isPaid ? createTransactionId() : undefined,
      paidAt: isPaid ? new Date() : undefined
    },
    ...totals
  });

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (String(order.user._id) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You cannot view this order");
  }

  res.json(order);
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (status) {
    order.status = status;

    if (status === "Delivered") {
      order.deliveredAt = new Date();
    }
  }

  if (paymentStatus) {
    order.payment.status = paymentStatus;

    if (paymentStatus === "Paid" && !order.payment.paidAt) {
      order.payment.paidAt = new Date();
      order.payment.transactionId = order.payment.transactionId || createTransactionId();
    }
  }

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

