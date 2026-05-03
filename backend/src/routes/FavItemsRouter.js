import express from "express";
import { toggleFav, getFavItems, clearFav } from "../controllers/favorite.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { favWriteLimiter, favReadLimiter, speedLimiter } from "../middleware/rateLimiter.js";

const FavItemsRouter = express.Router()

FavItemsRouter.post('/favorite/toggle', verifyJWT, speedLimiter, favWriteLimiter, toggleFav);

FavItemsRouter.get('/favorite/getItems', verifyJWT, speedLimiter, favReadLimiter, getFavItems);

FavItemsRouter.post('/favorite/clearall', verifyJWT, speedLimiter, favWriteLimiter, clearFav);

export {FavItemsRouter}