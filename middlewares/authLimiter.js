import { createRateLimit } from "../utils/rateLimiters.js";

export const loginLimiter = createRateLimit(
  15 * 60 * 1000,
  5,
  "Too many login attempts. Try again later"
);

export const otpLimiter = createRateLimit(
  10 * 60 * 1000,
  3,
  "Too many OTP requests. Wait a few minutes"
);

export const forgotPasswordLimiter = createRateLimit(
  60 * 60 * 1000,
  3,
  "Too many reset requests. Try again later"
);

export const bookingLimiter = createRateLimit(
  60 * 1000,
  10,
  "Too many booking requests"
);


export const adminLimiter = createRateLimit(
  60 * 1000,
  30,
  "Too many admin actions"
);

export const userLimiter = createRateLimit(
  60 * 1000,
  30,
  "Too many user actions"
);


export const generalLimiter = createRateLimit(
  60 * 1000,
  200,
  "Too many requests"
);