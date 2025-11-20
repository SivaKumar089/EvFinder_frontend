import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateBooking() {

    const { id } = useParams();  // ONLY station ID
    const [loading, setLoading] = useState(false);
    const [station, setStation] = useState(null); // station details
    const navigate = useNavigate();

    // 🔥 Fetch station details
    const loadStation = async () => {
        try {
            const res = await api.get(`/stations/${id}/`);
            setStation(res.data);
        } catch (err) {
            toast.error("Failed to load station");
        }
    };

    // FIX: useEffect must re-run when id changes
    useEffect(() => {
        loadStation();
    }, [id]);

    // 🔥 Create booking
    const handleBook = async () => {
        if (!station) return toast.error("Station not loaded");

        setLoading(true);

        try {
            const res = await api.post("/bookings/", {
                station: id,
                amount: station.price
            });


            toast.success("Booking Created Successfully!");
            navigate(`/payment/${res.data.id}`);
        } catch (err) {
            toast.error("Booking failed");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
                    🚗 Create Your Booking
                </h1>

                {/* Loading view */}
                {!station && (
                    <p className="text-center text-gray-500 mb-4">Loading station...</p>
                )}

                {/* Station info */}
                {station && (
                    <div className="p-4 border rounded-xl bg-gray-50 mb-5">
                        <p className="text-gray-700 text-lg">
                            <b>Station:</b> {station?.name}
                        </p>
                        <p className="text-gray-700 text-lg">
                            <b>ID:</b> {id}
                        </p>
                    </div>
                )}

                {/* Amount input */}
                <label className="text-gray-700 font-semibold">Amount</label>
                <input
                    type="number"
                    className="w-full border p-3 rounded-xl mb-4 bg-gray-50 shadow-sm"
                    value={station?.price}   // FIXED - no crash
                    readOnly
                />

                <button
                    onClick={handleBook}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded-xl text-lg font-semibold 
                               hover:bg-blue-700 transition-all shadow-md hover:shadow-xl"
                >
                    {loading ? "Booking..." : "Confirm Booking"}
                </button>
            </div>
        </div>
    );
}
