import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { serverURL } from "../App";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Send otp
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required.");
    setLoading(true);
    try {
      await axios.post(`${serverURL}/api/auth/send-otp`, { email });
      toast.success("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // verify otp
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${serverURL}/api/auth/verify-otp`, { email, otp });
      toast.success("OTP verified successfully.");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Both password fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${serverURL}/api/auth/reset-password`, {
        email,
        password: newPassword,
      });

      toast.success("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 text-gray-900 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 w-full max-w-md transition-all duration-300">
        {/* Step Title */}
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-2">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Reset Password"}
        </h2>

        {/* Step Subtitle */}
        {step === 3 && (
          <p className="text-sm text-gray-500 text-center mb-4">
            Enter a new password below to regain access to your account.
          </p>
        )}

        <form
          className="space-y-5"
          onSubmit={
            step === 1
              ? handleSendOtp
              : step === 2
              ? handleVerifyOtp
              : handleResetPassword
          }
        >
          {/* Step 1: Email */}
          {step === 1 && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none transition"
                placeholder="you@example.com"
              />
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="relative">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter 4-digit Code
              </label>
              <input
                type={showOtp ? "text" : "password"}
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none transition tracking-widest text-center"
                placeholder="* * * *"
              />
              <span
                onClick={() => setShowOtp(!showOtp)}
                className="absolute right-3 bottom-2.5 text-gray-500 cursor-pointer"
              >
                {showOtp ? (
                  <IoEyeOutline className="w-5 h-5" />
                ) : (
                  <IoEyeOffOutline className="w-5 h-5" />
                )}
              </span>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <>
              <div className="relative">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  id="new-password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none transition"
                  placeholder="Enter new password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-2.5 text-gray-500 cursor-pointer"
                >
                  {showPassword ? (
                    <IoEyeOutline className="w-5 h-5" />
                  ) : (
                    <IoEyeOffOutline className="w-5 h-5" />
                  )}
                </span>
              </div>

              <div className="relative">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none transition"
                  placeholder="Confirm password"
                />
                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 bottom-2.5 text-gray-500 cursor-pointer"
                >
                  {showConfirm ? (
                    <IoEyeOutline className="w-5 h-5" />
                  ) : (
                    <IoEyeOffOutline className="w-5 h-5" />
                  )}
                </span>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-md font-semibold transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900 text-white"
            }`}
          >
            {loading
              ? "Processing..."
              : step === 1
              ? "Send OTP"
              : step === 2
              ? "Verify OTP"
              : "Reset Password"}
          </button>
        </form>

        {/* Navigation */}
        <div className="text-sm text-center mt-4 text-gray-600">
          <span
            onClick={() => navigate("/login")}
            className="text-black underline cursor-pointer"
          >
            Back to Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
