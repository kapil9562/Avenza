import express from "express";
import { toggleFav, getFavItems, clearFav } from "../controllers/favorite.controller.js";

const FavItemsRouter = express.Router()

FavItemsRouter.post('/favorite/toggle', toggleFav);
FavItemsRouter.get('/favorite/getItems', getFavItems);
FavItemsRouter.post('/favorite/clearall', clearFav);

export {FavItemsRouter}