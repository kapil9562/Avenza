import connectDB from './src/db/db.js';
import express from "express";
import dotenv from "dotenv"
import cors from 'cors'
import { authRouter } from './src/routes/authRouter.js';
import { productRouter } from './src/routes/productRouter.js';
import { cartRouter } from './src/routes/cartRouter.js';
import { FavItemsRouter } from './src/routes/FavItemsRouter.js';


dotenv.config()
const app = express();
app.use(express.json())

const PORT = process.env.PORT || 8000

app.use(cors());
app.get('/', (req, res) => {
  res.send("Hello from Avenza server 👋")
})

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`)
})

app.use('/api', authRouter)
app.use('/api', productRouter)
app.use('/api', cartRouter)
app.use('/api', FavItemsRouter)

app.get("/ping", (req, res) => {
  res.send("Server is awake");
});

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running on port : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!!", env);
})