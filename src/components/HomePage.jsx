import React from "react";
import { motion } from "framer-motion";
import { FaBolt, FaMapMarkerAlt, FaWallet } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white fixed w-full top-0 z-50">
        <h1 className="text-2xl font-bold text-sky-600">⚡ ChargeMate</h1>
        <ul className="hidden md:flex gap-6 font-medium">
          <li className="hover:text-sky-600 cursor-pointer">Home</li>
          <li className="hover:text-sky-600 cursor-pointer">Stations</li>
          <li className="hover:text-sky-600 cursor-pointer">About</li>
          <li className="hover:text-sky-600 cursor-pointer">Contact</li>
        </ul>
        <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 text-center md:text-left flex flex-col md:flex-row items-center justify-center gap-10 px-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2"
        >
          <h1 className="text-5xl font-bold mb-4 text-sky-700">
            Find & Book EV Chargers Instantly ⚡
          </h1>
          <p className="text-lg mb-6 text-gray-700">
            Locate nearby charging stations, check slot availability, and
            charge your vehicle hassle-free.
          </p>
          <button className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition">
            🔍 Find Chargers Near You
          </button>
        </motion.div>

        <motion.img
          
          alt="EV Charger"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 w-80"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <h2 className="text-center text-3xl font-bold mb-10 text-sky-700">
          Why Choose ChargeMate?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<FaMapMarkerAlt size={40} />}
            title="Real-time Availability"
            desc="Check charger availability instantly before you arrive."
          />
          <FeatureCard
            icon={<FaWallet size={40} />}
            title="Secure Payments"
            desc="Book your slot and pay online safely in seconds."
          />
          <FeatureCard
            icon={<FaBolt size={40} />}
            title="Fast & Reliable"
            desc="Connect, charge, and get back on the road quickly."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-6 mt-10">
        <p>© 2025 ChargeMate. All rights reserved.</p>
        <p className="text-sm mt-2">Built with ❤️ by Siva Kumar</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-sky-50 p-8 rounded-2xl shadow hover:shadow-lg transition text-center">
      <div className="text-sky-600 mb-4 flex justify-center">{icon}</div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
