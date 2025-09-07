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
  googleOAuthCallback,
} from "../controllers/authController.js";
import { rateLimitMiddleware } from "../middlewares/rateLimit.js";
import {
  generalLimiter,
  loginLimiter,
  otpLimiter,
  resetPasswordLimiter,
} from "../config/limiter.js";
import passport from "passport";

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

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleOAuthCallback
);

export default authRouter;
