import express from "express";
import { buyNow, getAddress, getOrders, saveAddress, verifyPayment } from "../controllers/order.controller.js";

const orderRouter = express.Router()


orderRouter.post("/buy-now", buyNow);
orderRouter.post("/verify-payment", verifyPayment);

orderRouter.get("/get-orders", getOrders);

orderRouter.post("/save-address", saveAddress);
orderRouter.get("/get-address", getAddress);

export {orderRouter}