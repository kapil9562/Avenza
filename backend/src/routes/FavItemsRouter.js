import express from "express";
import { toggleFav, getFavItems } from "../controllers/favorite.controller.js";

const FavItemsRouter = express.Router()

FavItemsRouter.post('/favorite/toggle', toggleFav);
FavItemsRouter.get('/favorite/getItems', getFavItems);

export {FavItemsRouter}