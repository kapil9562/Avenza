import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many login attempts. Try again later."
    },
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
});

export const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 3,
    delayMs: (hits) => (hits - 3) * 500,
});

export const cartLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        message: "Too many cart actions. Please slow down."
    }
});

export const favWriteLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 40,
    message: {
        success: false,
        message: "Too many favorite actions. Slow down."
    }
});

export const favReadLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
});


// Payment / order critical (very strict)
export const paymentLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many payment attempts. Please wait."
    }
});

//Checkout limiter
export const checkoutLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
});

// Orders read
export const orderReadLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50,
});

// Address limiter
export const addressLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
});