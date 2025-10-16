import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo.uri);
    console.log("✅ MongoDb connected successfully");
  } catch (error) {
    console.log("❌ MongoDb connection failed");
    process.exit(1);
  }
};
