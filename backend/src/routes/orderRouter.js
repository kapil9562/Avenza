import express from "express";
import { buyNow, getAddress, saveAddress } from "../controllers/order.controller.js";

const orderRouter = express.Router()


orderRouter.post("/buy-now", buyNow);
orderRouter.post("/save-address", saveAddress);
orderRouter.get("/get-address", getAddress);

export {orderRouter}