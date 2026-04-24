import { createRateLimiter } from "./rateLimiters.js";

export const loginLimiter = createRateLimiter(
  15 * 60 * 1000,
  5,
  "Too many login attempts. Try again later"
);

export const otpLimiter = createRateLimiter(
  10 * 60 * 1000,
  3,
  "Too many OTP requests. Wait a few minutes"
);

export const forgotPasswordLimiter = createRateLimiter(
  60 * 60 * 1000,
  3,
  "Too many reset requests. Try again later"
);

export const bookingLimiter = createRateLimiter(
  60 * 1000,
  10,
  "Too many booking requests"
);


export const adminLimiter = createRateLimiter(
  60 * 1000,
  30,
  "Too many admin actions"
);

export const userLimiter = createRateLimiter(
  60 * 1000,
  30,
  "Too many user actions"
);


export const generalLimiter = createRateLimiter(
  60 * 1000,
  200,
  "Too many requests"
);