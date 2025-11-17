import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import MapModal from "../../components/MapModal";
import { MapPin, Save, ArrowLeft } from "lucide-react";

export default function EditStation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [openMap, setOpenMap] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStation = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await api.get(`/stations/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({
        ...res.data,
        lat: res.data.latitude,
        lng: res.data.longitude,
        type: res.data.type,
      });

    } catch (err) {
      console.error(err);
      alert("Failed to fetch station");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStation();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access");

      await api.put(
        `/stations/${id}/`,
        {
          name: form.name,
          latitude: form.lat,
          longitude: form.lng,
          price: form.price,
          type: form.type,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/evstations");
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;
  if (!form) return <div className="p-8 text-red-400">Station not found</div>;



  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-black via-gray-900 to-black text-white">

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/evstations")} className="bg-white/10 p-2 rounded-lg">
          <ArrowLeft />
        </button>
        <h1 className="text-3xl font-bold text-green-400">Edit Station</h1>
      </div>

      <form
        onSubmit={submit}
        className="bg-white/10 backdrop-blur-md p-6 rounded-2xl max-w-2xl mx-auto shadow-2xl border border-white/10"
      >
        {/* NAME */}
        <label className="block mb-4">
          <div className="text-sm text-gray-300 mb-1">Station Name</div>
          <input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20"
            required
          />
        </label>


        {/* LAT / LNG */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <label>
            <div className="text-sm text-gray-300 mb-1">Latitude</div>
            <input
              value={form.lat || ""}
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
              className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20"
            />
          </label>

          <label>
            <div className="text-sm text-gray-300 mb-1">Longitude</div>
            <input
              value={form.lng || ""}
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
              className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20"
            />
          </label>
        </div>

        {/* MAP PICKER */}
        <button
          type="button"
          onClick={() => setOpenMap(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl mb-4"
        >
          <MapPin className="w-5 h-5" />
          Pick From Map
        </button>

        {/* TYPE + PRICE */}
        <div className="grid grid-cols-2 gap-4 mb-4">

          <label>
            <div className="text-sm text-gray-300 mb-1">Charger Type</div>
            <select
              value={form.type || "car"}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20"
            >
              <option value="bike">Bike</option>
              <option value="car">Car</option>
              <option value="both">Both</option>
            </select>
          </label>

          <label>
            <div className="text-sm text-gray-300 mb-1">Price (₹)</div>
            <input
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20"
            />
          </label>

        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          className="flex items-center gap-2 bg-green-600 px-6 py-3 rounded-xl text-lg font-semibold w-full justify-center"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </form>

      {/* MAP MODAL */}
      {openMap && (
        <MapModal
          station={form}
          pickLocation={(lat, lng) => setForm({ ...form, lat: String(lat), lng: String(lng) })}
          onClose={() => setOpenMap(false)}
        />
      )}

    </div>
  );
}
