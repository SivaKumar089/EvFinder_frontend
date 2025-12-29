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

  {/* HEADER */}
  <header className="flex items-center gap-3 mb-10">
    <button
      onClick={() => navigate("/evstations")}
      className="bg-white/5 backdrop-blur-lg p-3 rounded-xl border border-white/10 hover:bg-white/10 transition"
    >
      <ArrowLeft />
    </button>
    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 drop-shadow-lg">
      Edit EV Station
    </h1>
  </header>

  {/* FORM CARD */}
  <form
    onSubmit={submit}
    className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl max-w-3xl mx-auto shadow-2xl border border-white/10 space-y-8"
  >

    {/* NAME */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">Station Name</label>
      <input
        value={form.name || ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-500/40 transition outline-none"
      />
    </div>

    {/* LAT / LNG */}
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Latitude</label>
        <input
          value={form.lat || ""}
          onChange={(e) => setForm({ ...form, lat: e.target.value })}
          className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-500/40 transition outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Longitude</label>
        <input
          value={form.lng || ""}
          onChange={(e) => setForm({ ...form, lng: e.target.value })}
          className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-500/40 transition outline-none"
        />
      </div>
    </div>

    {/* MAP BUTTON */}
    <button
      type="button"
      onClick={() => setOpenMap(true)}
      className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600/30 border border-blue-500/40 rounded-xl text-blue-300 font-semibold hover:bg-blue-600/40 hover:scale-[1.01] transition transform"
    >
      <MapPin className="w-5 h-5" />
      Pick Location From Map
    </button>

    {/* TYPE + PRICE */}
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Charger Type</label>
        <select
          value={form.type || "car"}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-500/40 transition"
        >
          <option value="bike">Bike</option>
          <option value="car">Car</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Price (₹)</label>
        <input
          value={form.price || ""}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-500/40 transition outline-none"
        />
      </div>
    </div>

    {/* SAVE BUTTON */}
    <button
      type="submit"
      className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-500 w-full py-4 rounded-2xl text-lg font-semibold tracking-wide justify-center 
      hover:from-green-500 hover:to-emerald-400 hover:scale-[1.02] transition transform shadow-xl"
    >
      <Save className="w-6 h-6" />
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
