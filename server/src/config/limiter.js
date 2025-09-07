import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";
import { config } from "./config.js";

const redisClient = new Redis(config.redis.url, {
  tls: {},
  enableOfflineQueue: false,
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

// Generic IP rate limiter (all routes fallback)
export const generalLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl_general",
  points: 10, // Only 10 attempts
  duration: 900, // 15 mins
  blockDuration: 120, // Block for 2 mins
});

// Login-specific limiter
export const loginLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl_login",
  points: 5, // Only 5 attempts
  duration: 300, // 5 mins
  blockDuration: 900, // Block for 15 mins
});

// OTP limiter
export const otpLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl_otp",
  points: 3, // Only 3 attempts
  duration: 300, // 5 mins
  blockDuration: 600, // Block for 10 mins
});

// Password reset limiter
export const resetPasswordLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl_reset",
  points: 5, // Only 5 attempts
  duration: 900, // 15 mins
  blockDuration: 600, // Block for 10 mins
});
