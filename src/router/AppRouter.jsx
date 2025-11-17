import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Signup";

import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";

import HomePage from "../components/HomePage"
import EvOwnerDashboard from "../pages/owner/EvOwnerDashboard";
import EvChargerDashboard from "../pages/charger/EvChargerDashboard";
import Stations from "../pages/owner/Stations";
import { isTokenExpired } from "../utils/checkToken";
import { useEffect } from "react";
import EvStations from "../pages/charger/EvStations";
import AddStation from "../pages/charger/AddStation";
import EditStation from "../pages/charger/EditStation";
import StationsMap from "../pages/owner/StationsMap";

export default function AppRouter() {
  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token && isTokenExpired(token)) {
      alert("Session expired. Please login again.");
      localStorage.clear();
      window.location.href = "/login";
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/evowner" element={<EvOwnerDashboard />} />
        <Route path="/chargerowner" element={<EvChargerDashboard />} />
        <Route path="/Stations" element={<Stations />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


        <Route path="/evstations" element={<EvStations />} />
        <Route path="/add-station" element={<AddStation />} />
        <Route path="/edit-station/:id" element={<EditStation />} />
        <Route path="/stationmap" element={<StationsMap />} />

      </Routes>
    </Router>
  );
}
