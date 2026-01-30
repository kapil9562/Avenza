import express from "express";
import { toggleFav, getFavItems } from "../controller/FavItems.controller.js";

const FavItemsRouter = express.Router()

FavItemsRouter.post('/favorite/toggle', toggleFav);
FavItemsRouter.get('/favorite/getItems', getFavItems);

export {FavItemsRouter}