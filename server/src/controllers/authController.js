import bcrypt from "bcryptjs";
import User from "../models/User.js";
import validator from "validator";
import genToken from "../config/token.js";
import sendMail from "../config/sendMail.js";

/**
 * @desc User Registration
 * @route POST /api/auth/signup
 * @access Public
 */
export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
    });

    const token = genToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      message: "Signup successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("🔴 Signup Error:", error);
    return res
      .status(500)
      .json({ message: "Signup failed. Please try again later." });
  }
};

/**
 * @desc User Login
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = genToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("🔴 Login Error:", error);
    return res
      .status(500)
      .json({ message: "Login failed. Please try again later." });
  }
};

/**
 * @desc User Logout
 * @route POST /api/auth/logout
 * @access Public (token cleared)
 */
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("🔴 Logout Error:", error);
    return res
      .status(500)
      .json({ message: "Logout failed. Please try again later." });
  }
};

/**
 * @desc Send password reset OTP to user email
 * @route POST /api/auth/send-otp
 * @access Public
 */
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing email address." });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that email does not exist
      return res
        .status(200)
        .json({ message: "If the account exists, an OTP has been sent." });
    }

    // Generate 4-digit numeric OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Set OTP and expiration
    user.resetOtp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    user.isOtpVerified = false;

    await user.save();

    // Send OTP email
    await sendMail({ to: email, otp });

    return res
      .status(200)
      .json({ message: "If the account exists, an OTP has been sent." });
  } catch (error) {
    console.error("🔴 sendOTP Error:", error);

    // Don’t leak internal errors to client
    return res.status(500).json({
      message: "Failed to send OTP. Please try again later.",
    });
  }
};

/**
 * @desc Verify otp
 * @route POST /api/auth/verify-otp
 * @access Public
 */

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Basic validation
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email: email.trim() });

    if (
      !user ||
      user.resetOtp !== otp.trim() ||
      !user.otpExpires ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Mark OTP as verified and clear OTP data
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("🔴 verifyOtp Error:", error);
    return res
      .status(500)
      .json({ message: "Failed to verify OTP. Please try again later." });
  }
};

/**
 * @desc    Reset user password after successful OTP verification
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and new password are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const user = await User.findOne({ email: email.trim() });

    if (!user || !user.isOtpVerified) {
      return res.status(400).json({
        message: "OTP verification is required before resetting the password.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.isOtpVerified = false;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("🔴 Reset Password Error:", error);
    return res.status(500).json({
      message: "Failed to reset password. Please try again later.",
    });
  }
};
