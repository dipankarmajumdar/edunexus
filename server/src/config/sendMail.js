import nodemailer from "nodemailer";
import { config } from "./config.js";

/**
 * Create transporter only once and reuse.
 */
const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

/**
 * Send OTP Email
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.otp - OTP code
 * @returns {Promise<void>}
 */
const sendMail = async ({ to, otp }) => {
  try {
    const mailOptions = {
      from: `"Support" <${config.smtp.user}>`,
      to,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2>Reset Your Password</h2>
          <p>Your OTP for password reset is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #000;">${otp}</p>
          <p>This code will expire in 5 minutes.</p>
          <br />
          <p>If you didn’t request this, you can ignore this email.</p>
          <p>Thanks,<br />The Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw new Error("Failed to send OTP email.");
  }
};

export default sendMail;
