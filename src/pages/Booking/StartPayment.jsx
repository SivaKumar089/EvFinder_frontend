import React, { useState } from "react";
import api from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function StartPayment() {
    const [data, setData] = useState(null);
    const {id} =useParams()
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // ---------- START PAYMENT ----------
    const start = async () => {
        if (!id) {
            toast.error("Booking ID is required");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/payments/create/", { booking_id: id });

            setData(res.data);
            toast.success("Order Created Successfully");
        } catch (err) {
            toast.error("Failed to create payment order");
        }
        setLoading(false);
    };

    // ---------- CONFIRM PAYMENT ----------
    const confirm = async () => {
        try {
            const res = await api.post(`/payments/${data.payment_id}/confirm/`);
            toast.success("Payment Success");
            navigate("/my-bookings");
        } catch (err) {
            toast.error("Payment failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
                    💳 Start Payment
                </h1>

                {/* Booking ID Input */}
                <label className="font-semibold text-gray-700">Booking ID</label>
                <input
                    placeholder="Enter Booking ID"
                    className="w-full mt-1 border p-3 rounded-xl mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={id}
                    readOnly
                />

                {/* Start Payment Button */}
                <button
                    onClick={start}
                    disabled={loading}
                    className="w-full p-3 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 transition-all shadow-md hover:shadow-xl"
                >
                    {loading ? "Creating Order..." : "Create Payment Order"}
                </button>

                {/* Order Details */}
                {data && (
                    <div className="mt-6 p-5 bg-gray-50 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold mb-3 text-blue-700">🧾 Order Details</h2>

                        <p className="text-gray-700">
                            <b>Order ID:</b> {data.order_id}
                        </p>
                        <p className="text-gray-700">
                            <b>Amount:</b> ₹{data.amount}
                        </p>

                        {/* Confirm Payment Button */}
                        <button
                            onClick={confirm}
                            className="mt-4 w-full p-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-xl"
                        >
                            Confirm Payment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
