import express from "express";
import {googleLogin, emailLogin, emailSendOTP, verifyOTP, sendResetOTP, verifyResetOTP, resetPassword, refreshAccessToken, logout, getCurrentUser} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const authRouter = express.Router()

// Auth routes
authRouter.get('/auth/google', googleLogin);
authRouter.post('/auth/emaillogin', emailLogin);
authRouter.post('/auth/sendotp', emailSendOTP);
authRouter.post('/auth/verifyotp', verifyOTP);
authRouter.post('/auth/forgot-password', sendResetOTP);
authRouter.post('/auth/verify-reset-otp', verifyResetOTP);
authRouter.post('/auth/reset-password', resetPassword);
authRouter.post('/auth/logout', verifyJWT, logout);
authRouter.post('/auth/refresh', refreshAccessToken);
authRouter.get('/auth/get-current-user', verifyJWT, getCurrentUser);

export {authRouter};