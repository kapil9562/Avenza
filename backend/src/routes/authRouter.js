import express from "express";
import {googleLogin, signup, emailLogin} from "../controllers/auth.controller.js";
// import { addToCart, getCart, updateQty } from "../controller/cart.controller.js";

const authRouter = express.Router()

authRouter.get('/test', (req, res)=> {
    res.send('test pass');
});


// Auth routes
authRouter.get('/auth/google', googleLogin);
authRouter.post('/auth/signup', signup);
// // router.post('/sendotp', loginSendOTP);
// // router.post('/verifyotp', verifyOTP);
authRouter.post('/auth/emaillogin', emailLogin);


export {authRouter};