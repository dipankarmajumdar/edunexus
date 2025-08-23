import express from "express";
import {
  createRazorpayOrder,
  verifyPayment,
} from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/order", authMiddleware, createRazorpayOrder);
paymentRouter.post("/verify", authMiddleware, verifyPayment);

export default paymentRouter;
