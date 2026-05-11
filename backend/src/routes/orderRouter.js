import express from "express";
import { buyCartItems, buyNow, getAddress, getOrderDetail, getOrders, saveAddress, verifyPayment } from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  paymentLimiter,
  checkoutLimiter,
  orderReadLimiter,
  addressLimiter,
  speedLimiter
} from "../middleware/rateLimiter.js";

const orderRouter = express.Router()

// Buy Now
orderRouter.post(
  "/buy-now",
  verifyJWT,
  speedLimiter,
  checkoutLimiter,
  buyNow
);

// Cart Checkout
orderRouter.post(
  "/checkout/cart",
  verifyJWT,
  speedLimiter,
  checkoutLimiter,
  buyCartItems
);

// Verify Payment
orderRouter.post(
  "/verify-payment",
  verifyJWT,
  speedLimiter,
  paymentLimiter,
  verifyPayment
);

// Get Orders
orderRouter.get(
  "/get-orders",
  verifyJWT,
  speedLimiter,
  orderReadLimiter,
  getOrders
);

// Address Routes
orderRouter.post(
  "/save-address",
  verifyJWT,
  addressLimiter,
  saveAddress
);

orderRouter.get(
  "/get-address",
  verifyJWT,
  addressLimiter,
  getAddress
);

// Order Detail
orderRouter.get(
  "/get-order-detail",
  verifyJWT,
  speedLimiter,
  orderReadLimiter,
  getOrderDetail
);

export {orderRouter}