import express from "express";
import {
  login,
  logout,
  signUp,
  sendOTP,
  verifyOtp,
  resetPassword,
  googleSignUp,
  googleLogin,
} from "../controllers/authController.js";
import { rateLimitMiddleware } from "../middlewares/rateLimit.js";
import {
  generalLimiter,
  loginLimiter,
  otpLimiter,
  resetPasswordLimiter,
} from "../config/limiter.js";

const authRouter = express.Router();

authRouter.post("/signup", rateLimitMiddleware(generalLimiter), signUp);
authRouter.post("/login", rateLimitMiddleware(loginLimiter), login);
authRouter.get("/logout", logout);
authRouter.post("/send-otp", rateLimitMiddleware(otpLimiter), sendOTP);
authRouter.post("/verify-otp", rateLimitMiddleware(otpLimiter), verifyOtp);
authRouter.post(
  "/reset-password",
  rateLimitMiddleware(resetPasswordLimiter),
  resetPassword
);
authRouter.post(
  "/google-signup",
  rateLimitMiddleware(generalLimiter),
  googleSignUp
);
authRouter.post(
  "/google-login",
  rateLimitMiddleware(loginLimiter),
  googleLogin
);

export default authRouter;
