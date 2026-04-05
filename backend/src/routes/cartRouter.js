import express from "express";
import { addToCart, getCart, updateQty , clearCart} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const cartRouter = express.Router()

// Cart routes
cartRouter.post('/cart/add', verifyJWT, addToCart);
cartRouter.get('/cart/get', verifyJWT, getCart);
cartRouter.post('/cart/updateqty', verifyJWT, updateQty);
cartRouter.post('/cart/clearall', verifyJWT, clearCart);

export {cartRouter};