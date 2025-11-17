// src/components/MapModal.jsx
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";

export default function MapModal({ station, pickLocation, onClose }) {
  const initialLat = Number(station?.latitude || 13.0827);
  const initialLng = Number(station?.longitude || 80.2707);

  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current).setView([initialLat, initialLng], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    // Marker drag event
    marker.on("dragend", () => {
      const { lat, lng } = marker.getLatLng();
      setLat(lat);
      setLng(lng);
    });

    // Map click event
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setLat(lat);
      setLng(lng);
      marker.setLatLng([lat, lng]);
    });

    return () => map.remove();
  }, []);

  // When input changes → Update marker + map view
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current._map.setView([lat, lng]);
    }
  }, [lat, lng]);

  const applyLocation = () => {
    pickLocation(lat, lng);
    onClose(true)
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white text-black rounded-lg w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="p-3 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Select Location</h3>
          <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="flex flex-1">

          {/* Map */}
          <div ref={mapRef} className="flex-1" />

          {/* Input panel */}
          <div className="w-72 p-4 bg-gray-100">
            <label className="block text-sm mb-1">Latitude</label>
            <input
              value={lat}
              onChange={(e) => setLat(Number(e.target.value))}
              className="w-full p-2 border rounded mb-3"
            />

            <label className="block text-sm mb-1">Longitude</label>
            <input
              value={lng}
              onChange={(e) => setLng(Number(e.target.value))}
              className="w-full p-2 border rounded mb-3"
            />

            <button
              onClick={applyLocation}
              className="w-full py-2 bg-green-600 text-white rounded"
            >
              Use This Location
            </button>

            <button
              onClick={() => { setLat(initialLat); setLng(initialLng); }}
              className="w-full mt-2 py-2 bg-gray-300 rounded"
            >
              Reset
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
