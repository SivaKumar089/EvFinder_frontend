// src/pages/Stations.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/axios"
import {
  Trash2, Edit, IndianRupee, ToggleRight,
  ToggleLeft, ThermometerSun
} from "lucide-react";
import {
  FaCar,
  FaBicycle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PriceModal from "../../components/PriceModal";

export default function EvStations() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);


  // PRICE MODAL STATES
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(null);


  const [showTempModal, setShowTempModal] = useState(false);
  const [selectedType, setSelectedType] = useState("bike");

  // Fetch Stations
  const fetchStations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");

      const res = await api.get("/stations/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStations(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load stations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // DELETE
  const deleteStation = async (id) => {
    if (!window.confirm("Delete this station?")) return;
    try {
      await api.delete(`/stations/${id}/`);
      fetchStations();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // -----------------------------
  //        PRICE UPDATE MODAL
  // -----------------------------
  const updatePrice = (id) => {
    setSelectedStationId(id);
    setShowPriceModal(true);
  };

  const submitNewPrice = async (price) => {
    if (!selectedStationId) {
      alert("Station ID missing");
      return;
    }

    try {
      const token = localStorage.getItem("access"); // GET TOKEN

      await api.put(
        `/stations/${selectedStationId}/set_price/`,
        { price: price },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ADD TOKEN HERE
          },
        }
      );

      setShowPriceModal(false);
      fetchStations();
    } catch (err) {
      console.error(err);
      alert("Failed to set price");
    }
  };



  // ACTIVE Toggle (PUT + Token Required + Optimistic UI)
  const toggleActive = async (id, currentState) => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Token missing. Please login again.");
      navigate("/login");
      return;
    }

    // Correct toggle value
    const newState = !currentState;   // ✔ flip true/false

    // Optimistic UI update
    setStations((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, is_active: newState } : s
      )
    );

    try {
      // PUT method with Token
      await api.put(
        `/stations/${id}/set_active/`,
        { is_active: newState },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect only when turning ON


      // Refresh from backend
      fetchStations();

    } catch (err) {
      console.error("toggleActive error:", err);

      // Revert UI if failed
      setStations((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, is_active: currentState } : s
        )
      );

      alert("Failed to toggle active.");
    }
  };


  // TEMP TYPE
  const submitTempType = async () => {
    const token = localStorage.getItem("access");

    try {
      await api.put(
        `/stations/${selectedStationId}/set_temp_type/`,
        { type: selectedType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowTempModal(false);
      fetchStations();

    } catch (err) {
      console.error(err);
      alert("Failed to update type");
    }
  };


  return (
    <div className="min-h-screen p-8 bg-black text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-400">My Charging Stations</h1>
        <button
          onClick={() => navigate("/add-station")}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
        >
          + Add Station
        </button>
      </div>

{loading ? (
  <p className="text-gray-400">Loading...</p>
) : (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {stations.map((s) => (
      <div
        key={s.id}
        className="backdrop-blur-lg bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-300"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-green-300">{s.name}</h2>
            <p className="text-gray-400 text-sm">{s.address}</p>
          </div>
          <span className={`w-3 h-3 rounded-full ${
            s.is_active ? "bg-green-400" : "bg-red-500"
          }`} />
        </div>

        {/* Divider */}
        <hr className="border-gray-700 my-4" />

        {/* Buttons Section */}
        <div className="grid grid-cols-3 gap-4">

          {/* Update Price */}
          <button
            className="flex flex-col items-center bg-yellow-500/20 hover:bg-yellow-500/30 p-3 rounded-xl transition border border-yellow-600/20"
            onClick={() => updatePrice(s.id)}
          >
            <IndianRupee className="w-6 h-6" />
            <span className="text-xs mt-1">Price</span>
          </button>

          {/* Toggle Active */}
          <button
            onClick={() => toggleActive(s.id, s.is_active)}
            className={`col-span-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition border ${
              s.is_active
                ? "bg-green-500/10 border-green-700/40 hover:bg-green-500/20"
                : "bg-gray-700/40 border-gray-500/30 hover:bg-gray-600/50"
            }`}
          >
            {s.is_active ? (
              <>
                <ToggleRight className="w-6 h-6 text-green-400" />
                <span className="text-sm text-green-200 font-semibold">Active</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-6 h-6 text-gray-300" />
                <span className="text-sm text-gray-300 font-semibold">Inactive</span>
              </>
            )}
          </button>

          {/* Set Temp */}
          <button
            className="flex flex-col items-center bg-purple-500/20 hover:bg-purple-500/30 p-3 rounded-xl transition border border-purple-500/20"
            onClick={() => {
              setSelectedStationId(s.id);
              setShowTempModal(true);
            }}
          >
            <FaBicycle className="w-5 h-5" />
            <FaCar className="w-5 h-5 -mt-1" />
            <span className="text-xs mt-1">Temp</span>
          </button>

          {/* Edit Station */}
          <button
            onClick={() => navigate(`/edit-station/${s.id}`)}
            className="col-span-2 bg-green-600/20 hover:bg-green-600/30 p-3 rounded-xl flex items-center justify-center gap-2 font-medium transition border border-green-700/20"
          >
            <Edit />
            Edit Station
          </button>

          {/* Delete */}
          <button
            onClick={() => deleteStation(s.id)}
            className="bg-red-500/20 hover:bg-red-500/30 p-3 rounded-xl flex items-center justify-center transition border border-red-500/20"
          >
            <Trash2 />
          </button>
        </div>
      </div>
    ))}
  </div>
)}





      {/* PRICE MODAL */}
      {showPriceModal && (
        <PriceModal
          onClose={() => setShowPriceModal(false)}
          onSubmit={submitNewPrice}
        />
      )}
      {showTempModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-xl">

            <h2 className="text-xl font-semibold mb-4">Select Temp Type</h2>

            <select
              className="w-full p-3 rounded-xl border border-gray-300 text-black 
  bg-white shadow-sm hover:shadow-md transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  cursor-pointer font-medium"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="bike">🚲 Bike</option>
              <option value="car">🚗 Car</option>
              <option value="both">🚗🚲 Both</option>
            </select>


            <div className="flex justify-end gap-2 mt-5">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowTempModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-purple-600 text-white rounded"
                onClick={() => submitTempType()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
