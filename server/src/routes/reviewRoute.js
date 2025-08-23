import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createReview, getReviews } from "../controllers/reviewController.js";

const reviewRoute = express.Router();

reviewRoute.post("/create", authMiddleware, createReview);
reviewRoute.get("/get", authMiddleware, getReviews);

export default reviewRoute;
