import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const OwnerSummary = () => {
  const [summary, setSummary] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await api.get(`/summary/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
      } catch (error) {
        if (error.response?.status === 401) alert("Session expired. Login!");
        else alert("Failed to load summary");
      }
    };
    fetchSummary();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8 text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            ⚡ Owner Charger Summary
          </h1>
          <p className="text-gray-400 mt-2">Live overview of your charger business</p>
        </div>

        {/* CONTENT */}
        {summary.length === 0 ? (
          <div className="flex justify-center my-10">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          summary.map((item, index) => (
            <div
              key={index}
              className="mb-8 p-6 rounded-2xl bg-white/10 backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.4)] 
              border border-white/10 transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,255,179,0.4)] hover:scale-[1.02]"
               onClick={() => navigate(`/bookings/${item.station__id}`)}
            >
              <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
                🔌 {item.station__name}
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                <Card value={item.total_bookings} label="Total Bookings" color="text-yellow-400" />
                <Card value={item.paid_bookings} label="Paid" color="text-green-400" />
                <Card value={item.pending_bookings} label="Pending" color="text-red-400" />
                <Card value={item.expired_bookings} label="Expired" color="text-gray-400" />

                {/* REVENUE CARD FULL WIDTH */}
                <div className="sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-xl shadow-inner text-center">
                  <p className="text-white font-extrabold text-3xl">{item.total_revenue} ₹</p>
                  <p className="text-sm text-white/70 font-medium uppercase tracking-wider mt-1">
                    Total Revenue Generated
                  </p>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

const Card = ({ value, label, color }) => (
  <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-center hover:bg-white/10 transition">
    <p className={`font-extrabold text-3xl ${color}`}>{value}</p>
    <p className="text-gray-300 text-sm tracking-wide mt-1">{label}</p>
  </div>
);

export default OwnerSummary;
