import express from "express";
import { addToCart, getCart, updateQty } from "../controllers/cart.controller.js";

const cartRouter = express.Router()

// Cart routes
cartRouter.post('/cart/add', addToCart);
cartRouter.get('/cart/get', getCart);
cartRouter.post('/cart/updateqty', updateQty);

export {cartRouter};