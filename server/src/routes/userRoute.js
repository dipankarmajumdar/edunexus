import express from "express";
import {
  getCurrentUser,
  updateProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandler.js";

const userRoute = express.Router();

userRoute.get("/me", authMiddleware, getCurrentUser);
userRoute.post(
  "/profile",
  authMiddleware,
  upload.single("photoUrl"),
  multerErrorHandler,
  updateProfile
);

export default userRoute;
