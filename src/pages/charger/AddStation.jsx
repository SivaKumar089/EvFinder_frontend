// src/pages/AddStation.jsx
import React, { useState } from "react";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import MapModal from "../../components/MapModal";

export default function AddStation() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    type: "bike",
    price: "",
    is_active: true,
    current_type: "bike",
  });

  const [openMap, setOpenMap] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 🔥 MapModal -> parent form input
  const pickLocation = (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: String(lat),
      longitude: String(lng),
    }));
    setOpenMap(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/stations/", form);
      navigate("/stations");
    } catch (err) {
      console.error(err);
      alert("Failed to add station");
    } finally {
      setSubmitting(false);
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-10 text-white">

  {/* Header */}
  <div className="flex items-center justify-between max-w-3xl mx-auto mb-10">
    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
      Add EV Station
    </h1>
  </div>

  {/* Card */}
  <form
    onSubmit={submit}
    className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl max-w-3xl mx-auto shadow-2xl border border-white/10 space-y-8"
  >

    {/* Station Name */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">Station Name</label>
      <input
        className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 transition outline-none"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
    </div>

    {/* Description */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">Description</label>
      <textarea
        className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 transition outline-none"
        rows={3}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />
    </div>

    {/* Location Inputs */}
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Latitude</label>
        <input
          className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 transition outline-none"
          placeholder="Latitude"
          value={form.latitude}
          onChange={(e) => setForm({ ...form, latitude: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Longitude</label>
        <input
          className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 transition outline-none"
          placeholder="Longitude"
          value={form.longitude}
          onChange={(e) => setForm({ ...form, longitude: e.target.value })}
        />
      </div>
    </div>

    {/* Pick Map Button */}
    <button
      type="button"
      onClick={() => setOpenMap(true)}
      className="w-full py-3 rounded-2xl bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/40 hover:bg-blue-600/40 hover:border-blue-400/60 transition flex items-center justify-center gap-2"
    >
      📍 Pick Location From Map
    </button>

    {/* Type + Price */}
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Charger Type</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 transition outline-none"
        >
          <option value="bike">🔋 Bike</option>
          <option value="car">🚗 Car</option>
          <option value="both">⚡ Both</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Price (₹)</label>
        <input
          type="number"
          className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 transition outline-none"
          placeholder="₹ Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-4 pt-4">
      <button
        type="submit"
        disabled={submitting}
        className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl text-lg font-semibold hover:scale-[1.02] transition shadow-md disabled:opacity-50"
      >
        {submitting ? "Adding..." : "Add Station"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/evstations")}
        className="flex-1 py-3 bg-white/10 rounded-2xl text-lg hover:bg-white/20 transition"
      >
        Cancel
      </button>
    </div>

  </form>

  {/* MAP MODAL */}
  {openMap && (
    <MapModal
      station={form}
      pickLocation={pickLocation}
      onClose={() => setOpenMap(false)}
    />
  )}

</div>

  );
}
