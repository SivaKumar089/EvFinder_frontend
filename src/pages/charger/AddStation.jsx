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
    <div className="min-h-screen p-8 bg-black text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Add New Station</h1>

      <form
        onSubmit={submit}
        className="bg-white/5 backdrop-blur p-6 rounded-xl max-w-2xl border border-white/10"
      >
        {/* Name */}
        <label className="block mb-4">
          <span className="text-gray-300 text-sm mb-1 block">Station Name</span>
          <input
            className="w-full p-2 rounded bg-gray-900 text-white"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        {/* Description */}
        <label className="block mb-4">
          <span className="text-gray-300 text-sm mb-1 block">Description</span>
          <textarea
            className="w-full p-2 rounded bg-gray-900 text-white"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </label>

        {/* Lat/Lng */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            placeholder="Latitude"
            className="p-2 rounded bg-gray-900"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
          />

          <input
            placeholder="Longitude"
            className="p-2 rounded bg-gray-900"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
          />
        </div>

        {/* Pick From Map */}
        <button
          type="button"
          onClick={() => setOpenMap(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded mb-4"
        >
          Pick From Map
        </button>

        {/* Type + price */}
        <div className="flex gap-3 mb-4">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="p-2 rounded bg-gray-900"
          >
            <option value="bike">Bike</option>
            <option value="car">Car</option>
            <option value="both">Both</option>
          </select>

          <input
          type="number"
            placeholder="Price"
            className="p-2 rounded bg-gray-900"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add Station"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/stations")}
            className="px-6 py-2 bg-white/10 rounded hover:bg-white/20"
          >
            Cancel
          </button>
        </div>
      </form>

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
