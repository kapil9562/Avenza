import express from "express";
import { getAllCategory, getProducts, productReview } from "../controllers/product.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const productRouter = express.Router()

//product routes
productRouter.get('/products', getProducts);
productRouter.get('/category-list', getAllCategory);
productRouter.post('/post-review', verifyJWT, productReview);

export {productRouter}