import express from "express";
import { buyNow, getAddress, getOrderDetail, getOrders, saveAddress, verifyPayment } from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  paymentLimiter,
  checkoutLimiter,
  orderReadLimiter,
  addressLimiter,
  speedLimiter,
  speedLimiter2
} from "../middleware/rateLimiter.js";

const orderRouter = express.Router()

// Buy Now
orderRouter.post(
  "/buy-now",
  verifyJWT,
  speedLimiter2,
  checkoutLimiter,
  buyNow
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
  speedLimiter2,
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
  speedLimiter2,
  orderReadLimiter,
  getOrderDetail
);

export {orderRouter}