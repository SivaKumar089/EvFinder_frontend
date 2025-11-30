import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSignInAlt, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "../utils/axios";
import { useState } from "react";

const Login = () => {
  const [email_or_username, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIdentifierError("");
    setPasswordError("");

    if (!email_or_username) {
      setIdentifierError("Email or username is required.");
      return;
    }
    if (!password) {
      setPasswordError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/login/", {
        email_or_username,
        password,
      });
      
      
      // ✅ Get all values properly from the response
      const { access, refresh } = res.data;
      const { role } = res.data.user;
     
      
      
      // ✅ Save them in localStorage
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("role", role);

      toast.success("✅ Login successful!");

      // ✅ Add a small delay to show the toast, then navigate
     
      
      setTimeout(() => {
        if (role === "evowner") navigate("/evowner");
        else if (role === "chargerowner") navigate("/chargerowner");
        else navigate("/"); // fallback
      }, 800);
    } catch (err) {
      toast.error("❌ Your username or password is incorrect.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 via-gray-900 to-black p-6">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-gray-700 shadow-2xl rounded-3xl p-8 text-gray-100"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <FaSignInAlt className="mx-auto text-green-400 text-5xl mb-3" />
          <h2 className="text-3xl font-extrabold text-green-400">Welcome Back</h2>
          <p className="text-gray-300 text-sm mt-1">
            Login to continue your journey
          </p>
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email or Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              value={email_or_username}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setIdentifierError("");
              }}
              placeholder="Enter email or username"
              className={`w-full px-4 py-2 rounded-xl bg-gray-900/50 border ${identifierError ? "border-red-500" : "border-gray-600"
                } focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-100 placeholder-gray-400 shadow-inner`}
            />
            {identifierError && (
              <p className="flex items-center gap-1 text-red-400 text-sm mt-1">
                <FaExclamationCircle /> {identifierError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder="••••••••"
              className={`w-full px-4 py-2 rounded-xl bg-gray-900/50 border ${passwordError ? "border-red-500" : "border-gray-600"
                } focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-100 placeholder-gray-400 shadow-inner`}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-green-400 transition"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
            {passwordError && (
              <p className="flex items-center gap-1 text-red-400 text-sm mt-1">
                <FaExclamationCircle /> {passwordError}
              </p>
            )}
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold shadow-md transition-all duration-300 ${loading
              ? "bg-green-800 cursor-not-allowed opacity-70"
              : "hover:bg-green-700 hover:shadow-green-500/30"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Links */}
        <div className="text-center text-sm text-gray-400 mt-6 space-y-2">
          <p>
            Forgot your password?{" "}
            <a
              href="/forgot-password"
              className="text-green-400 font-medium hover:underline"
            >
              Reset here
            </a>
          </p>
          <p>
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-green-400 font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
