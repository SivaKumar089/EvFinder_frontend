import React, { useEffect, useState } from "react";
import api from "../../utils/axios"


export default function PaymentHistory() {
    const [data, setData] = useState([]);


    useEffect(() => {
        load();
    }, []);


    const load = async () => {
        const res = await api.get("/payments/");
        setData(res.data);
    };


    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Payment History</h1>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.map((p) => (
                    <div key={p.id} className="p-4 bg-white rounded shadow">
                        <h2 className="text-lg font-semibold">{p.station_name}</h2>
                        <p>Amount: ₹{p.amount}</p>
                        <p>Status: {p.status}</p>
                        <p>Order: {p.gateway_order_id}</p>
                        <p>Payment: {p.gateway_payment_id}</p>
                        <p>Date: {p.created_at}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}