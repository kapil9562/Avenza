import express from "express";
import { addToCart, getCart, updateQty , clearCart} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { cartLimiter, speedLimiter } from "../middleware/rateLimiter.js";


const cartRouter = express.Router()

cartRouter.post('/cart/add', verifyJWT, speedLimiter, cartLimiter, addToCart);

cartRouter.get('/cart/get', verifyJWT, speedLimiter, cartLimiter, getCart);

cartRouter.post('/cart/updateqty', verifyJWT, speedLimiter, cartLimiter, updateQty);

cartRouter.post('/cart/clearall', verifyJWT, speedLimiter, cartLimiter, clearCart);

export {cartRouter};