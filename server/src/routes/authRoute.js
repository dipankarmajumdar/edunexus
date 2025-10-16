import express from "express";
import {
  login,
  logout,
  signUp,
  sendOTP,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post(
  "/reset-password",
  resetPassword
);

export default authRouter;
