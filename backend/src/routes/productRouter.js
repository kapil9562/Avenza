import express from "express";
import { getAllCategory, getProducts } from "../controllers/product.controller.js";

const productRouter = express.Router()

//product routes
productRouter.get('/products', getProducts);
productRouter.get('/category-list', getAllCategory);
// productRouter.get('/products?limit=${5}&search=${title}', searchProducts);
// productRouter.get('/products?id=${productId}', getProductById);

export {productRouter}