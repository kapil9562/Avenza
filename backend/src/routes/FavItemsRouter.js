import express from "express";
import { toggleFav, getFavItems, clearFav } from "../controllers/favorite.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { favWriteLimiter, favReadLimiter, speedLimiter2 } from "../middleware/rateLimiter.js";

const FavItemsRouter = express.Router()

FavItemsRouter.post('/favorite/toggle', verifyJWT, speedLimiter2, favWriteLimiter, toggleFav);

FavItemsRouter.get('/favorite/getItems', verifyJWT, speedLimiter2, favReadLimiter, getFavItems);

FavItemsRouter.post('/favorite/clearall', verifyJWT, speedLimiter2, favWriteLimiter, clearFav);

export {FavItemsRouter}