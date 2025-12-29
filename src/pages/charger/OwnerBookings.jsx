import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import { useParams } from "react-router-dom";
import {
  BatteryCharging,
  User,
  Clock3,
  Timer,
} from "lucide-react";

export default function BookingReports() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");

      const res = await api.get(`/bookings/stations/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch bookings!");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchBookings();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-transparent">
          ⚡ Station Booking Reports
        </h1>

        {/* LOADING */}
        {loading && (
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Loading bookings...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-6 text-center">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* NO DATA */}
        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-gray-400 text-xl mb-4">🚫 No bookings available</p>
            <button
              onClick={fetchBookings}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition"
            >
              Refresh
            </button>
          </div>
        )}

        {/* BOOKINGS TABLE (NOW MOBILE FRIENDLY) */}
        {!loading && !error && bookings.length > 0 && (
          <div className="block overflow-auto rounded-2xl shadow-xl bg-white/5 border border-white/10 backdrop-blur-xl mt-6">
            <table className="w-full table-auto text-center">


              <tbody>
                {bookings.map((item) => (
                  <tr key={item.id} className="hover:bg-white/10 border-b border-white/10 transition">
                    <td className="p-4 text-xs text-gray-400 whitespace-nowrap">
                      {item.id?.slice(0, 8)}...
                    </td>

                    <td className="p-4 whitespace-nowrap flex justify-center items-center gap-2">
                      <BatteryCharging size={18} className="text-green-400" />
                      {item.station_name || "N/A"}
                    </td>

                    <td className="p-4 whitespace-nowrap flex justify-center items-center gap-2">
                      <User size={18} className="text-blue-400" />
                      {item.user_name || "Unknown"}
                    </td>

                    <td className="p-4 font-bold text-yellow-300 whitespace-nowrap">
                      ₹ {item.amount}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "CONFIRMED"
                            ? "bg-green-800/40 text-green-300 border border-green-600/30"
                            : "bg-red-800/40 text-red-300 border border-red-600/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-sm whitespace-nowrap flex gap-2 justify-center items-center">
                      <Clock3 size={16} className="text-purple-400" />
                      {formatDate(item.created_at)}
                    </td>

                    <td className="p-4 text-sm whitespace-nowrap flex gap-2 justify-center items-center">
                      <Timer size={16} className="text-orange-400" />
                      {formatDate(item.expires_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REFRESH BUTTON */}
        {!loading && bookings.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={fetchBookings}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 rounded-xl transition shadow-lg"
            >
              🔄 Refresh Data
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
