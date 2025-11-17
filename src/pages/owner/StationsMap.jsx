// StationsMap.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "../../utils/axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  MapPin,
  Navigation2,
  Pin,
  AlertTriangle,
} from "lucide-react";

// FIX default Leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;

// ⭐ CUSTOM ICONS


const myLocationIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/819/819814.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

// BIKE ICON
const bikeIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/851/851587.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// CAR ICON
const carIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743007.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// BOTH ICON (Bike + Car)
const bothIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2969/2969875.png",
  iconSize: [42, 42],
  iconAnchor: [21, 42],
});




function getStationIcon(type) {
  if (!type) return carIcon;

  if (type === "bike") return bikeIcon;
  if (type === "car") return carIcon;
  if (type === "both") return bothIcon;

  return carIcon; // fallback
}




// ⭐ Haversine distance
function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ⭐ Recenter component
function Recenter({ lat, lng, zoom = 14 }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], zoom);
  }, [lat, lng, zoom, map]);
  return null;
}

export default function StationsMap({ apiUrl = "/stations/", nearbyKm = 5 }) {
  const [stations, setStations] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nearbyOnly, setNearbyOnly] = useState(true);
  const [message, setMessage] = useState("");

  const mapRef = useRef();

  // ⭐ Get location + load stations
  useEffect(() => {
    (async function init() {
      setLoading(true);

      if (!navigator.geolocation) {
        setMessage("Geolocation not supported — showing all chargers.");
        fetchStations(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          setUserLoc({ lat, lng });
          setMapCenter({ lat, lng });

          fetchStations({ lat, lng });
        },
        (err) => {
          console.warn("Location denied:", err);
          setMessage("Location permission denied — showing all chargers.");
          setUserLoc(null);
          setMapCenter(null);
          fetchStations(null);
        }
      );
    })();
  }, []);

  // ⭐ Fetch stations
  async function fetchStations(userCoords) {
    try {
      const res = await axios.get(apiUrl);
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];

      const normalized = data.map((s) => ({
        ...s,
        latitude: Number(s.latitude),
        longitude: Number(s.longitude),
      }));

      if (!userCoords) {
        setNearbyOnly(false);
        setStations(normalized);
        return;
      }

      const withDist = normalized.map((s) => ({
        ...s,
        distance_km: haversineKm(
          userCoords.lat,
          userCoords.lng,
          s.latitude,
          s.longitude
        ),
      }));

      const within = withDist.filter((s) => s.distance_km <= nearbyKm);

      if (within.length === 0) {
        setNearbyOnly(false);
        setMessage(`No stations within ${nearbyKm} km.`);
      } else {
        setNearbyOnly(true);
        setMessage(`Found ${within.length} nearby station(s).`);
      }

      setStations(withDist);
    } catch (e) {
      console.log(e);
      setMessage("Failed to load stations.");
    } finally {
      setLoading(false);
    }
  }

  const displayStations =
    userLoc && nearbyOnly
      ? stations.filter((s) => s.distance_km <= nearbyKm)
      : stations;

  // ⭐ PIN & DIRECTIONS
  function handlePin(station) {
    setMapCenter({ lat: station.latitude, lng: station.longitude });
  }

  function handleDirections(station) {
    const dest = `${station.latitude},${station.longitude}`;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${dest}`,
          "_blank"
        );
      },
      () => {
        window.open(
          `https://www.google.com/maps/search/?api=1&query=${dest}`,
          "_blank"
        );
      }
    );
  }

  // ⭐ UI
  return (
    <div className="p-6 flex flex-col lg:flex-row gap-8 bg-slate-50 min-h-screen">

      {/* LEFT SIDE MAP */}
      <div className="lg:w-2/3 w-full">
        <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">

          {/* HEADER */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-100 to-white border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                EV Charger Finder
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => userLoc && setMapCenter(userLoc)}
                className="px-4 py-2 border rounded-xl text-sm hover:bg-slate-100 flex gap-2 items-center"
              >
                <Navigation2 className="w-4 h-4 text-blue-600" />
                My Location
              </button>

              <button
                onClick={() => setNearbyOnly(!nearbyOnly)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 flex gap-2 items-center text-sm"
              >
                <Pin className="w-4 h-4" />
                {nearbyOnly ? "Nearby" : "All"}
              </button>
            </div>
          </div>

          {/* MAP */}
          <div className="relative h-[540px]">

            {!mapCenter && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-10 backdrop-blur-sm">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-medium text-slate-600">
                  Fetching your location…
                </p>
              </div>
            )}

            <MapContainer
              center={mapCenter ? [mapCenter.lat, mapCenter.lng] : [0, 0]}
              zoom={mapCenter ? 13 : 2}
              scrollWheelZoom
              className="w-full h-full"
              whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
            >
              {mapCenter && (
                <Recenter lat={mapCenter.lat} lng={mapCenter.lng} />
              )}

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* USER LOCATION ICON */}
              {userLoc && (
                <>
                  <Circle
                    center={[userLoc.lat, userLoc.lng]}
                    radius={nearbyKm * 1000}
                    pathOptions={{ color: "#2563EB", fillOpacity: 0.12 }}
                  />

                  <Marker
                    position={[userLoc.lat, userLoc.lng]}
                    icon={myLocationIcon}
                  >
                    <Popup><strong>Your Live Location</strong></Popup>
                  </Marker>
                </>
              )}

              {/* STATIONS */}
              {displayStations.map((s) => (
                 <Marker
    key={s.id}
    position={[s.latitude, s.longitude]}
    icon={getStationIcon(s.type)}
  >
                  <Popup>
                    <div className="min-w-[220px]">
                      <h3 className="font-semibold text-slate-900">
                        {s.store_name || s.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {s.owner_name}
                      </p>

                      {s.distance_km && (
                        <p className="text-xs text-blue-600 font-medium mt-1">
                          {s.distance_km.toFixed(2)} km away
                        </p>
                      )}

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleDirections(s)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 text-sm"
                        >
                          Directions
                        </button>

                        <button
                          onClick={() => handlePin(s)}
                          className="px-3 py-1 border rounded-lg text-sm hover:bg-slate-100"
                        >
                          Pin
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE LIST */}
      <div className="lg:w-1/3 w-full flex flex-col gap-6">
        <div className="bg-white rounded-3xl shadow-xl border p-6">
          <h3 className="text-xl font-bold text-slate-800">Charger List</h3>
          <p className="text-sm text-slate-600 mt-2">{message}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border overflow-auto" style={{ maxHeight: 470 }}>
          {displayStations.length === 0 && !loading ? (
            <div className="p-8 text-center text-slate-500">
              <AlertTriangle className="mx-auto mb-2 w-10 h-10 text-orange-500" />
              No chargers found nearby
            </div>
          ) : (
            <ul className="divide-y">
              {displayStations.map((s) => (
                <li key={s.id} className="p-5 hover:bg-slate-50 transition">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold text-lg text-slate-800">
                        {s.store_name || s.name}
                      </div>
                      <p className="text-xs text-slate-500">{s.owner_name}</p>
                    </div>

                    <div className="text-right">
                      {s.distance_km && (
                        <div className="text-blue-600 font-bold text-sm">
                          {s.distance_km.toFixed(2)} km
                        </div>
                      )}
                      <p className="text-xs text-slate-400">
                        {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handlePin(s)}
                      className="px-4 py-1.5 border rounded-xl text-sm hover:bg-slate-100"
                    >
                      Pin
                    </button>
                    <button
                      onClick={() => handleDirections(s)}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 text-sm"
                    >
                      Directions
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border p-5">
          <p className="text-sm text-slate-600">
            Allow location permission to get accurate results.
          </p>
        </div>
      </div>
    </div>
  );
}
