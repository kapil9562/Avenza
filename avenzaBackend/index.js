import express from "express";
import dotenv from "dotenv";
import {authRouter} from './src/routes/authRouter.js'
import { poolPromise } from "./src/db/index.js";
import cors from 'cors'
dotenv.config();
import { productRouter } from "./src/routes/productRouter.js";
import { cartRouter } from "./src/routes/cartRouter.js";
import { FavItemsRouter } from "./src/routes/FavItemsRouter.js";

const PORT = process.env.PORT || 5000

const app = express();
app.use(express.json())

app.use(cors());
app.get('/', (req, res) => {
  res.send("hello from auth server")
})

app.use('/api', authRouter)
app.use('/api', cartRouter)
app.use('/api', productRouter)
app.use('/api', FavItemsRouter)

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`)
})

const startServer = async () => {
  try {
    await poolPromise;
    console.log("✅ DB ready");
  } catch (err) {
    console.error("❌ Server failed to start:", err);
  }
};

startServer();