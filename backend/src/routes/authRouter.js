import express from "express";
import {googleLogin, emailLogin, emailSendOTP, verifyOTP, sendResetOTP, verifyResetOTP, resetPassword} from "../controllers/auth.controller.js";

const authRouter = express.Router()

authRouter.get('/test', (req, res)=> {
    res.send('test pass');
});


// Auth routes
authRouter.get('/auth/google', googleLogin);
authRouter.post('/auth/emaillogin', emailLogin);
authRouter.post('/auth/sendotp', emailSendOTP);
authRouter.post('/auth/verifyotp', verifyOTP);
authRouter.post('/auth/forgot-password', sendResetOTP);
authRouter.post('/auth/verify-reset-otp', verifyResetOTP);
authRouter.post('/auth/reset-password', resetPassword);

export {authRouter};