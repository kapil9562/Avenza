import express from "express";
import { toggleFav, getFavItems, clearFav } from "../controllers/favorite.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const FavItemsRouter = express.Router()

FavItemsRouter.post('/favorite/toggle', verifyJWT, toggleFav);
FavItemsRouter.get('/favorite/getItems', verifyJWT, getFavItems);
FavItemsRouter.post('/favorite/clearall', verifyJWT, clearFav);

export {FavItemsRouter}