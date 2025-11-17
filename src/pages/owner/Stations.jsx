import React, { useEffect, useState } from "react";
import axios from  "../../utils/axios"
import { FaChargingStation } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import StationCard from "../../components/StationCard";

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          setError("Authentication required. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get("stations/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStations(response.data);
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError("Failed to load stations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-emerald-600 font-semibold text-lg animate-pulse">
            ⚡ Loading Stations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <MdErrorOutline className="text-red-500 text-6xl mb-4" />
        <p className="text-gray-700 font-semibold text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FaChargingStation className="text-emerald-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">
            EV Charging Stations
          </h1>
        </div>
        <p className="text-gray-500 text-sm">
          Total: <span className="font-semibold">{stations.length}</span>
        </p>
      </div>

      {stations.length === 0 ? (
        <div className="flex flex-col justify-center items-center mt-32">
          <FaChargingStation className="text-gray-400 text-5xl mb-3" />
          <p className="text-gray-500 text-lg">No stations found ⚡</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <div
              key={station.id}
              className="transform transition duration-300 hover:-translate-y-2"
            >
              <StationCard station={station} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stations;
