import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { FaChargingStation } from "react-icons/fa";

export default function MyBookings() {
    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState("CONFIRMED"); 

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const res = await api.get("/bookings/my-bookings/");
        setData(res.data);
    };

    const confirmed = data.filter((b) => b.status === "CONFIRMED");
    const expired = data.filter((b) => b.status === "EXPIRED");

    return (
        <div className="max-w-5xl mx-auto p-4">

            {/* Title */}
            <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-blue-600 to-green-600 text-transparent bg-clip-text drop-shadow-lg">
                ⚡ My Bookings
            </h1>

            {/* ------------------ BEAUTIFUL TABS ------------------ */}
            <div className="flex justify-center mb-10">
                <div className="flex bg-gray-100 rounded-2xl p-1 shadow-inner backdrop-blur-lg">

                    <button
                        onClick={() => setActiveTab("CONFIRMED")}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200
                            ${activeTab === "CONFIRMED"
                                ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg scale-105"
                                : "text-gray-600 hover:text-blue-600"
                            }`}
                    >
                        Confirmed
                    </button>

                    <button
                        onClick={() => setActiveTab("EXPIRED")}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200
                            ${activeTab === "EXPIRED"
                                ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105"
                                : "text-gray-600 hover:text-red-600"
                            }`}
                    >
                        Expired
                    </button>

                </div>
            </div>

            {/* ------------------ CARD GRID ------------------ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* CONFIRMED cards */}
                {activeTab === "CONFIRMED" &&
                    confirmed.map((b) => (
                        <div
                            key={b.id}
                            className="p-6 rounded-3xl shadow-xl bg-white/80 backdrop-blur-md 
                                       border border-green-300 hover:shadow-2xl hover:scale-[1.02]
                                       transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Glow Highlight */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-green-400 opacity-20 blur-2xl"></div>

                            <div className="flex items-center gap-4 mb-3">
                                <FaChargingStation className="text-blue-600 text-4xl" />
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {b.station_name}
                                </h3>
                            </div>

                            <div className="space-y-1 text-gray-700 text-lg">
                                <p><b>Amount:</b> ₹{b.amount}</p>

                                <p className="flex items-center gap-2">
                                    <MdCheckCircle className="text-green-600 text-2xl" />
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                        {b.status}
                                    </span>
                                </p>

                                <p className="text-sm text-gray-500">
                                    <b>Created:</b> {new Date(b.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))
                }

                {/* EXPIRED cards */}
                {activeTab === "EXPIRED" &&
                    expired.map((b) => (
                        <div
                            key={b.id}
                            className="p-6 rounded-3xl shadow-xl bg-white/80 backdrop-blur-md 
                                       border border-red-300 hover:shadow-2xl hover:scale-[1.02]
                                       transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Glow Highlight */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-red-400 opacity-20 blur-2xl"></div>

                            <div className="flex items-center gap-4 mb-3">
                                <FaChargingStation className="text-red-600 text-4xl" />
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {b.station_name}
                                </h3>
                            </div>

                            <div className="space-y-1 text-gray-700 text-lg">
                                <p><b>Amount:</b> ₹{b.amount}</p>

                                <p className="flex items-center gap-2">
                                    <MdCancel className="text-red-600 text-2xl" />
                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                                        {b.status}
                                    </span>
                                </p>

                                <p className="text-sm text-gray-500">
                                    <b>Created:</b> {new Date(b.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    );
}
