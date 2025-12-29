import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaBolt,
  FaCar,
  FaBicycle,
} from "react-icons/fa";

import MiniMap from "./MiniMap";
import { useNavigate } from "react-router-dom";
 

const StationCard = ({ station }) => {
  const navigate=useNavigate()
  const [placeName, setPlaceName] = useState("Loading...");
  const role = localStorage.getItem("role");
  // Reverse geocoding — FREE API
  const getPlaceName = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );


      const data = await res.json();
      const addr = data?.address;




      if (!addr) return "Unknown Location";


      // Priority order for short names
      const shortName =
        addr.suburb;

      return shortName || "Unknown Location";
    } catch (err) {
      return "Unknown Location";
    }
  };


  useEffect(() => {
    (async () => {
      const name = await getPlaceName(station.latitude, station.longitude);
      setPlaceName(name);
    })();
  }, [station]);

  // Open full map in new tab
  const openFullMap = () => {
    window.open(
      `https://www.google.com/maps?q=${station.latitude},${station.longitude}`,
      "_blank"
    );
  };


  // Type Icons
const renderTypeIcons = () => {
  if (station.type === "bike") return <FaBicycle className="text-green-400 text-xl" />;
  if (station.type === "car") return <FaCar className="text-blue-400 text-xl" />;
  if (station.type === "both")
    return (
      <div className="flex gap-2">
        <FaBicycle className="text-green-400 text-xl" />
        <FaCar className="text-blue-400 text-xl" />
      </div>
    );
};


  return (
<div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.01] transition duration-300">

  {/* Mini Map Box */}
  <div
    onClick={openFullMap}
    className="absolute top-6 right-6 w-32 h-32 rounded-xl overflow-hidden shadow-md border border-white/20 cursor-pointer hover:scale-105 transition"
  >
    <MiniMap lat={station.latitude} lon={station.longitude} />
  </div>

  {/* Card Content */}
  <div className="pr-40 space-y-3">

    {/* Name + Bolt */}
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-600 tracking-wide">
        {station.name}
      </h2>
      <FaBolt className="text-emerald-400 text-2xl drop-shadow-sm" />
    </div>

    {/* Location */}
    <p className="text-gray-600 text-sm flex items-center gap-2">
      <FaMapMarkerAlt className="text-emerald-400" />
      {placeName}
    </p>

    {/* Type */}
    <div className="flex gap-2 items-center mt-1">
      <span className="font-medium text-gray-600">Type:</span>
      <div className="flex gap-2 items-center text-lg">
        {renderTypeIcons()}
      </div>
    </div>

    {/* Price */}
    <div className="flex gap-2 items-center">
      <span className="text-gray-600 font-medium">Price:</span>
      <span className="text-emerald-300 font-bold text-lg">
        ₹{station.price}
      </span>
    </div>

    {/* Status */}
    <div className="flex gap-2 items-center">
      <span className="text-gray-600 font-medium">Status:</span>
      {station.is_active ? (
        <span className="text-emerald-500 font-semibold bg-emerald-500/20 px-2 py-1 rounded-lg text-sm">
          Active
        </span>
      ) : (
        <span className="text-red-500 font-semibold bg-red-500/20 px-2 py-1 rounded-lg text-sm">
          Inactive
        </span>
      )}
    </div>

    {/* Book Button */}
    {role === "evowner" && (
      <button
        onClick={() => navigate(`/booking/${station.id}`)}
        className="mt-4 px-6 py-2 w-fit bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl
        text-white font-semibold shadow-md hover:shadow-blue-400/40 hover:scale-[1.03] transition"
      >
        Book Now 🚗⚡
      </button>
    )}
  </div>
</div>

  );
};

export default StationCard;
