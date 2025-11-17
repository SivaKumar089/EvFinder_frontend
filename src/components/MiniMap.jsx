import { useEffect, useRef } from "react";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { MapPin } from "lucide-react";

const MiniMap = ({ lat, lon }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Custom marker using Tailwind classes
    const iconHTML = ReactDOMServer.renderToString(
      <div className="relative w-14 h-14 flex items-center justify-center">
        {/* Outer glow pulse */}
        <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
        
        {/* Main marker circle */}
        <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/30">
          {/* Inner shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full" />
          
          {/* Icon */}
          <MapPin className="w-6 h-6 text-white relative z-10" strokeWidth={2.5} />
        </div>
        
        {/* Pointer tail */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-indigo-600 drop-shadow-lg" />
      </div>
    );

    const icon = L.divIcon({
      html: iconHTML,
      className: "",
      iconSize: [56, 56],
      iconAnchor: [28, 56],
    });

    // Clear existing map instance
    mapRef.current.innerHTML = "";

    const map = L.map(mapRef.current, {
      center: [lat, lon],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    });

    // Modern dark tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Add marker with bounce animation
    const marker = L.marker([lat, lon], { icon }).addTo(map);
    
    // Optional: Add subtle animation on load
    setTimeout(() => {
      marker.setLatLng([lat, lon]);
    }, 100);

    return () => map.remove();
  }, [lat, lon]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-2 ring-gray-200/50 dark:ring-gray-700/50 bg-gray-100"
    />
  );
};

export default MiniMap;