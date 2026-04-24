import rateLimit from "express-rate-limit";

export const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            msg
        }
    });
}