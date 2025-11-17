import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { FaEnvelope, FaCheckCircle, FaExclamationCircle, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
     const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSendOTP = async () => {
    setEmailError("");
    if (!email) {
      setEmailError("Email is required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/api/send-otp/", { email });
      setMessage(res.data.message);
      toast.success("OTP sent successfully!");
      setOtpSent(true);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Your email is not registered.";
      setEmailError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setOtpError("OTP is required.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/api/verify-otp/", { email, code: otp });
      toast.success(res.data.message || "OTP verified successfully!");
      setOtpVerified(true);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Invalid or expired OTP.";
      setOtpError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setPasswordError("");
    if (!otpVerified) {
      toast.warning("Please verify your OTP before resetting password.");
      return;
    }
    if (!newPassword) {
      setPasswordError("New password is required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put("http://127.0.0.1:8000/api/forgot-password/", {
        email,
        new_password: newPassword,
      });
      toast.success("Password reset successfully!");
      setEmail("");
      setOtp("");
      setNewPassword("");
      setOtpSent(false);
      setOtpVerified(false);
      setMessage("✅ Password reset successfully!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to reset password.";
      toast.error(errorMsg);
      setPasswordError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 via-gray-900 to-black p-6">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg border border-gray-700 rounded-3xl shadow-2xl w-full max-w-md p-8 text-gray-100"
      >
        <h1 className="text-3xl font-extrabold text-green-400 mb-6 text-center">
          forgot Password
        </h1>

        {message && (
          <p className="text-green-400 text-sm text-center mb-3 flex justify-center items-center gap-1">
            <FaCheckCircle /> {message}
          </p>
        )}

        {/* Email Input */}
        <div className="mb-5 text-left relative">
          <label className="block text-sm font-semibold mb-1">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            disabled={otpVerified}
            className={`w-full px-4 py-2 rounded-lg bg-gray-900/40 border ${
              emailError ? "border-red-500" : "border-gray-500"
            } focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-100 ${
              otpVerified ? "cursor-not-allowed opacity-70" : ""
            }`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
          />
          {emailError && (
            <p className="flex items-center gap-1 text-red-400 text-sm mt-1">
              <FaExclamationCircle /> {emailError}
            </p>
          )}
          {!otpSent && (
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className={`mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-all ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          )}
        </div>

        {/* OTP Field */}
        {otpSent && !otpVerified && (
          <div className="mb-5 text-left">
            <label className="block text-sm font-semibold mb-1">Enter OTP</label>
            <input
              type="number"
              placeholder="6-digit OTP"
              className={`w-full px-4 py-2 rounded-lg bg-gray-900/40 border ${
                otpError ? "border-red-500" : "border-gray-500"
              } text-center tracking-widest focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-100`}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setOtpError("");
              }}
            />
            {otpError && (
              <p className="flex items-center gap-1 text-red-400 text-sm mt-1">
                <FaExclamationCircle /> {otpError}
              </p>
            )}
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className={`mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* New Password */}
        {otpVerified && (
          <div className="mb-5 text-left">
            <label className="block text-sm font-semibold mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-2 rounded-lg bg-gray-900/40 border ${
                passwordError ? "border-red-500" : "border-gray-500"
              } focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-100`}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError("");
              }}
            />
            {passwordError && (
              <p className="flex items-center gap-1 text-red-400 text-sm mt-1">
                <FaExclamationCircle /> {passwordError}
              </p>
            )}
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className={`mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-all ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}

        <p className="mt-6 text-sm text-center text-gray-300">
          Remember your password?{" "}
          <a href="/auth/login" className="text-green-400 hover:underline">
            Login here
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
