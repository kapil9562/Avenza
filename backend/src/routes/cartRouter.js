import express from "express";
import { addToCart, getCart, updateQty , clearCart} from "../controllers/cart.controller.js";

const cartRouter = express.Router()

// Cart routes
cartRouter.post('/cart/add', addToCart);
cartRouter.get('/cart/get', getCart);
cartRouter.post('/cart/updateqty', updateQty);
cartRouter.post('/cart/clearall', clearCart);

export {cartRouter};