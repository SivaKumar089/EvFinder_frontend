import React from "react";
import { motion } from "framer-motion";
import { FaBolt, FaMapMarkerAlt, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen relative overflow-hidden 
      bg-gradient-to-br from-green-900 via-gray-900 to-black p-6 
      text-white flex items-center justify-center"
    >
      {/* FLOATING GLOW ORBS */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" />

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
        className="relative max-w-6xl w-full grid md:grid-cols-2 gap-14
        bg-white/5 backdrop-blur-2xl rounded-3xl p-10
        shadow-[0_0_60px_rgba(34,197,94,0.15)]
        border border-white/10"
      >
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Power Your{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              EV Journey
            </span>
            <br /> Smarter
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-xl">
            Find nearby EV charging stations, check live availability,
            reserve slots instantly, and pay securely — all from one platform.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-10 flex gap-5 flex-wrap">
            <button
              onClick={() => navigate("/login")}
              className="relative px-8 py-4 rounded-xl bg-green-500 text-black font-semibold
              shadow-[0_0_30px_rgba(34,197,94,0.6)]
              hover:shadow-[0_0_60px_rgba(34,197,94,0.9)]
              hover:scale-110 transition-all duration-300"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 rounded-xl border border-green-400 text-green-400 font-semibold
              hover:bg-green-400 hover:text-black hover:scale-110 transition-all duration-300"
            >
              Create Account
            </button>
          </div>
        </motion.div>

        {/* RIGHT FEATURES */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 gap-6"
        >
          <Feature
            icon={<FaMapMarkerAlt />}
            title="Live Station Map"
            desc="Discover nearby charging stations with real-time availability."
          />
          <Feature
            icon={<FaWallet />}
            title="Secure Payments"
            desc="Pay online safely with trusted and fast payment systems."
          />
          <Feature
            icon={<FaBolt />}
            title="Fast Charging"
            desc="High-speed chargers to get you back on the road quickly."
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -6 }}
      transition={{ type: "spring", stiffness: 180 }}
      className="group relative overflow-hidden rounded-2xl p-6
      bg-gradient-to-br from-white/10 to-white/5
      border border-white/10 backdrop-blur-xl
      shadow-[0_0_30px_rgba(0,0,0,0.4)]"
    >
      {/* GLOW EFFECT */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition
        bg-gradient-to-r from-green-400/20 to-emerald-400/10 blur-2xl"
      />

      <div className="relative z-10 flex gap-4 items-start">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-green-400 text-3xl"
        >
          {icon}
        </motion.div>

        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-300 text-sm mt-1">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}
