import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import passport from "./config/passport.js";

import { config } from "./config/config.js";
import { connectDB } from "./config/db.js";

import authRouter from "./routes/authRoute.js";
import courseRoute from "./routes/courseRoute.js";
import userRoute from "./routes/userRoute.js";
import paymentRouter from "./routes/paymentRouter.js";
import reviewRoute from "./routes/reviewRoute.js";
// dotenv.config();

const app = express();

// Basic security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.client.url,
    credentials: true,
  })
);

// Body & Cookie parsers
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Sample route
app.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

// Actual route
app.use("/api/auth", authRouter);
app.use("/api/users", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/payments", paymentRouter);
app.use("/api/reviews", reviewRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Connect DB & start server
connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`🚀 Server running on https://edunexus-7ekm.onrender.com`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect DB:", error);
  });
