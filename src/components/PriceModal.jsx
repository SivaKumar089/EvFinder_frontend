// src/components/PriceModal.jsx
import React, { useState } from "react";

export default function PriceModal({ onClose, onSubmit }) {
  const [price, setPrice] = useState("");

  const handleSubmit = () => {
    if (!price.trim()) {
      alert("Price is required");
      return;
    }
    onSubmit(price);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Update Charger Price
        </h2>

        <input
          type="number"
          placeholder="Enter new price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 border text-black border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-green-500 focus:outline-none mb-5"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg 
                       hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg 
                       hover:bg-green-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
