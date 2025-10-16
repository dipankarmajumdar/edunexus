import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized", error: error.message });
  }
};

export default authMiddleware;
