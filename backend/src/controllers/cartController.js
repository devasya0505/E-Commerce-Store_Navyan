import asyncHandler from "express-async-handler";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

const populateCart = (query) => query.populate("items.product");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

const formatCart = (cart) => {
  const validItems = cart.items.filter((item) => item.product);
  const subtotal = validItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return {
    id: cart._id,
    user: cart.user,
    items: validItems,
    itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    tax: Number((subtotal * 0.08).toFixed(2)),
    shippingFee: subtotal > 0 && subtotal < 500 ? 49 : 0,
    total: Number((subtotal + subtotal * 0.08 + (subtotal > 0 && subtotal < 500 ? 49 : 0)).toFixed(2))
  };
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await populateCart(Cart.findOne({ user: req.user._id }));

  if (!cart) {
    const newCart = await getOrCreateCart(req.user._id);
    const populatedCart = await populateCart(Cart.findById(newCart._id));
    res.json(formatCart(populatedCart));
    return;
  }

  res.json(formatCart(cart));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error("Requested quantity exceeds available stock");
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find((item) => String(item.product) === String(productId));

  if (existingItem) {
    const nextQuantity = existingItem.quantity + Number(quantity);

    if (nextQuantity > product.stock) {
      res.status(400);
      throw new Error("Cart quantity exceeds available stock");
    }

    existingItem.quantity = nextQuantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  const populatedCart = await populateCart(Cart.findById(cart._id));
  res.status(201).json(formatCart(populatedCart));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (quantity < 1) {
    res.status(400);
    throw new Error("Quantity must be at least 1");
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (quantity > product.stock) {
    res.status(400);
    throw new Error("Requested quantity exceeds available stock");
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.find((cartItem) => String(cartItem.product) === String(productId));

  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  item.quantity = quantity;
  await cart.save();

  const populatedCart = await populateCart(Cart.findById(cart._id));
  res.json(formatCart(populatedCart));
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => String(item.product) !== String(req.params.productId)
  );

  await cart.save();
  const populatedCart = await populateCart(Cart.findById(cart._id));
  res.json(formatCart(populatedCart));
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json(formatCart(cart));
});

