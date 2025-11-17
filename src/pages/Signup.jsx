import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosGitCommit } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [code, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("evowner");

  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();


  const handleSendOTP = async () => {
    setMessage("");
    setEmailError("");

    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/api/signup-send-otp/", { email });
      setMessage(res.data.message);
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (err) {
      setEmailError(err.response?.data?.error || "Failed to send OTP. Try again.");
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setOtpError("");
    if (!code) {
      setOtpError("Please enter your OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/api/emailverify-otp/", {
        email,
        code,
      });
      setMessage(res.data.message);
      setOtpVerified(true);
      toast.success("Email verified successfully!");
    } catch (err) {
      setOtpError(err.response?.data?.error || "Invalid or expired OTP.");
      toast.error("OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setPasswordError("");
    setUsernameError("");

    if (!otpVerified) {
      toast.warning("Please verify your email first!");
      return;
    }
    if (!username) {
      setUsernameError("Username is required.");
      return;
    }
    if (!password) {
      setPasswordError("Password is required.");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://127.0.0.1:8000/api/signup/", {
        username,
        email,
        password,
        role,
      });
      toast.success("Account created successfully!");
      setMessage("✅ Account created successfully!");
      setUsername("");
      setEmail("");
      setOtp("");
      setPassword("");
      setOtpSent(false);
      setOtpVerified(false);
      navigate("/login")
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-800 to-gray-900 p-6">
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center text-gray-100"
      >
        <h1 className="text-3xl font-extrabold text-green-400 mb-6 tracking-wide">
          <IoIosGitCommit />Create Your Account  
        </h1>

        {/* ✅ USERNAME FIELD */}
        {otpVerified && (
          <div className="mb-5 text-left">
            <label className="block text-sm font-semibold mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className={`w-full px-4 py-2 rounded-lg bg-gray-900/40 border ${
                usernameError ? "border-red-500" : "border-gray-500"
              } focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-100`}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError("");
              }}
            />
            {usernameError && (
              <p className="flex items-center gap-1 text-red-400 text-sm mt-1">
                <FaExclamationCircle /> {usernameError}
              </p>
            )}
          </div>
        )}

        {/* ✅ EMAIL FIELD */}
        <div className="mb-5 text-left relative">
          <label className="block text-sm font-semibold mb-1">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            disabled={otpVerified}
            className={`w-full px-4 py-2 rounded-lg bg-gray-900/40 border ${
              emailError ? "border-red-500" : "border-gray-500"
            } focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-100 ${
              otpVerified ? "cursor-not-allowed opacity-70" : "cursor-pointer"
            }`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
          />
          {otpVerified && (
            <FaCheckCircle className="absolute right-3 top-9 text-green-400 text-lg" />
          )}
          {emailError && (
            <p className="flex items-center gap-1 text-red-400 text-sm mt-1">
              <FaExclamationCircle /> {emailError}
            </p>
          )}
          {!otpSent && (
            <button
              onClick={handleSendOTP}
              disabled={loading || otpVerified}
              className={`mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-all
              ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          )}
          {message && (
            <p className="flex items-center gap-1 text-green-400 text-sm mt-2">
              <FaCheckCircle /> {message}
            </p>
          )}
        </div>

        {/* ✅ OTP FIELD */}
        {otpSent && !otpVerified && (
          <div className="mb-5 text-left">
            <label className="block text-sm font-semibold mb-1">Enter OTP</label>
            <input
              type="number"
              placeholder="6-digit OTP"
              maxLength={6}
              className={`w-full px-4 py-2 rounded-lg bg-gray-900/40 border ${
                otpError ? "border-red-500" : "border-gray-500"
              } text-center tracking-widest focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-100`}
              value={code}
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
                loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* ✅ PASSWORD + ROLE + SIGNUP BUTTON */}
        {otpVerified && (
          <>
            <div className="mb-4 text-left">
              <label className="block text-sm font-semibold mb-1">Create Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-2 rounded-lg bg-gray-900/40 border ${
                  passwordError ? "border-red-500" : "border-gray-500"
                } focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-100`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
              />
              {passwordError && (
                <p className="flex items-center gap-1 text-red-400 text-sm mt-1">
                  <FaExclamationCircle /> {passwordError}
                </p>
              )}
            </div>

            <div className="mb-5 text-left">
              <label className="block text-sm font-semibold mb-1">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-900/40 border border-gray-500 focus:ring-2 focus:ring-green-400 text-gray-100 focus:outline-none"
              >
                <option value="evowner">EV Owner</option>
                <option value="chargerowner">Charger Owner</option>
              </select>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-all ${
                loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </>
        )}

        <p className="mt-6 text-sm text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-green-400 hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
