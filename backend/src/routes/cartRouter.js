import express from "express";
import { addToCart, getCart, updateQty , clearCart} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { cartLimiter, speedLimiter2 } from "../middleware/rateLimiter.js";


const cartRouter = express.Router()

cartRouter.post('/cart/add', verifyJWT, speedLimiter2, cartLimiter, addToCart);

cartRouter.get('/cart/get', verifyJWT, cartLimiter, getCart);

cartRouter.post('/cart/updateqty', verifyJWT, speedLimiter2, cartLimiter, updateQty);

cartRouter.post('/cart/clearall', verifyJWT, speedLimiter2, cartLimiter, clearCart);

export {cartRouter};