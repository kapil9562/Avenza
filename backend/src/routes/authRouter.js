import express from "express";
import {googleLogin, emailLogin, emailSendOTP, verifyOTP, sendResetOTP, verifyResetOTP, resetPassword, refreshAccessToken, logout, getCurrentUser} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  loginLimiter,
  generalLimiter,
  speedLimiter
} from "../middleware/rateLimiter.js";

const authRouter = express.Router()

// Auth routes
authRouter.get('/auth/google', speedLimiter, generalLimiter, googleLogin);

authRouter.post('/auth/emaillogin', speedLimiter, loginLimiter, emailLogin);

authRouter.post('/auth/sendotp', speedLimiter, generalLimiter, emailSendOTP);

authRouter.post('/auth/verifyotp', speedLimiter, verifyOTP);

authRouter.post('/auth/forgot-password', speedLimiter, generalLimiter, sendResetOTP);

authRouter.post('/auth/verify-reset-otp', speedLimiter, verifyResetOTP);

authRouter.post('/auth/reset-password', speedLimiter, resetPassword);

authRouter.post('/auth/logout', verifyJWT, logout);

authRouter.post('/auth/refresh', refreshAccessToken);

authRouter.get('/auth/get-current-user', verifyJWT, getCurrentUser);

export {authRouter};