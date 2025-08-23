import jwt from "jsonwebtoken";
import { config } from "./config.js";

const genToken = (user) => {
  if (!config.jwt.secret) {
    throw new Error("JWT secret is not defined in config");
  }

  const payload = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: "7d",
  });
};

export default genToken;
