import express from "express";
import { buyNow, getAddress, getOrderDetail, getOrders, saveAddress, verifyPayment } from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const orderRouter = express.Router()


orderRouter.post("/buy-now",verifyJWT, buyNow);
orderRouter.post("/verify-payment",verifyJWT, verifyPayment);

orderRouter.get("/get-orders",verifyJWT, getOrders);

orderRouter.post("/save-address",verifyJWT, saveAddress);
orderRouter.get("/get-address",verifyJWT, getAddress);
orderRouter.get("/get-order-detail",verifyJWT, getOrderDetail);

export {orderRouter}