import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import { config } from "../config/config.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

const { ObjectId } = mongoose.Types;

// ---- Razorpay instance
export const razorpay = new Razorpay({
  key_id: config.razorpay.key.id,
  key_secret: config.razorpay.key.secret,
});

// ---- Utils
const isObjectId = (id) => ObjectId.isValid(id);

const sendError = (res, code, message, extra = {}) =>
  res.status(code).json({ success: false, message, ...extra });

const sendOk = (res, payload = {}) =>
  res.status(200).json({ success: true, ...payload });

/**
 * POST /api/payments/order
 * body: { courseId, userId }
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { courseId, userId } = req.body || {};

    if (!courseId || !isObjectId(courseId)) {
      return sendError(res, 400, "Invalid or missing courseId");
    }
    if (!userId || !isObjectId(userId)) {
      return sendError(res, 400, "Invalid or missing userId");
    }

    const [course, user] = await Promise.all([
      Course.findById(courseId).select("_id title price"),
      User.findById(userId).select("_id name"),
    ]);

    if (!course) return sendError(res, 404, "Course not found");
    if (!user) return sendError(res, 404, "User not found");

    const amountPaise = Math.max(0, Math.trunc(Number(course.price) * 100));
    if (!amountPaise) return sendError(res, 400, "Course price is invalid");

    // Make the receipt unique and meaningful
    const receipt = `${course._id}`;

    const options = {
      amount: amountPaise,
      currency: "INR",
      receipt,
      notes: {
        courseId: String(course._id),
        userId: String(user._id),
        courseTitle: String(course.title || ""),
      },
    };

    const order = await razorpay.orders.create(options);

    return sendOk(res, {
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        notes: order.notes,
        status: order.status,
      },
      keyId: config.razorpay.key.id,
    });
  } catch (error) {
    console.error("createRazorpayOrder error:", error);
    return sendError(res, 500, "Failed to create Razorpay order");
  }
};

/**
 * POST /api/payments/verify
 * body: { courseId, userId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      courseId,
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    // Basic validation
    if (!courseId || !isObjectId(courseId)) {
      return sendError(res, 400, "Invalid or missing courseId");
    }
    if (!userId || !isObjectId(userId)) {
      return sendError(res, 400, "Invalid or missing userId");
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return sendError(res, 400, "Missing Razorpay payment details");
    }

    // Verify signature
    const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", config.razorpay.key.secret)
      .update(signBody)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return sendError(res, 400, "Payment signature verification failed");
    }

    // Fetch payment to double-check amount/currency/status
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (!payment) {
      return sendError(res, 400, "Unable to fetch payment details");
    }
    if (payment.status !== "captured") {
      return sendError(
        res,
        400,
        `Payment not captured (status: ${payment.status})`
      );
    }
    if (payment.currency !== "INR") {
      return sendError(res, 400, "Unsupported currency");
    }

    // Verify course & user exist (and prevent duplicates atomically)
    const [course, user] = await Promise.all([
      Course.findById(courseId).select("_id enrollmentStudents"),
      User.findById(userId).select("_id enrolledCourses"),
    ]);

    if (!course) return sendError(res, 404, "Course not found");
    if (!user) return sendError(res, 404, "User not found");

    await Promise.all([
      User.updateOne(
        { _id: userId },
        { $addToSet: { enrolledCourses: courseId } }
      ),
      Course.updateOne(
        { _id: courseId },
        { $addToSet: { enrollmentStudents: userId } }
      ),
    ]);

    return sendOk(res, {
      message: "Payment verified and enrollment successful",
      paymentId: payment.id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error("verifyPayment error:", error);
    return sendError(
      res,
      500,
      "Internal server error during payment verification"
    );
  }
};
