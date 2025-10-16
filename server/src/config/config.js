import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  mongo: {
    uri: process.env.MONGO_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  client: {
    url: process.env.CLIENT_URL,
  },
  smtp: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === "true",
  },
  cloudinary: {
    name: process.env.CLOUDINARY_NAME,
    api: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_SECRET_KEY,
  },
  razorpay: {
    key: {
      id: process.env.RAZORPAY_KEY_ID,
      secret: process.env.RAZORPAY_KEY_SECRET,
    },
  },
};
