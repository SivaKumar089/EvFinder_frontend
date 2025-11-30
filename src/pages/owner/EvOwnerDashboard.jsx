import { FaCarSide, FaTicketAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EvOwnerDashboard = () => {
    const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-400 flex items-center gap-2">
          <FaCarSide /> EV Owner Dashboard
        </h1>
        <FaUserCircle className="text-4xl text-gray-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-green-500/20 transition" onClick={()=> navigate('/my-bookings')}>
          <FaTicketAlt className="text-3xl text-green-400 mb-3" />
          <h3 className="text-xl font-semibold mb-1">My Bookings</h3>
          <p className="text-sm text-gray-400">
            View and manage your EV charging bookings easily.
          </p>
        </div>

        <div className="bg-white/10 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-green-500/20 transition" onClick={()=> navigate('/Stations')}>
          <FaCarSide className="text-3xl text-green-400 mb-3" />
          <h3 className="text-xl font-semibold mb-1">Nearby Chargers</h3>
          <p className="text-sm text-gray-400">
            Find available EV chargers near your current location.
          </p>
        </div>

        <div className="bg-white/10 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-green-500/20 transition"onClick={()=> navigate('/stationmap')}>
          <FaCarSide className="text-3xl text-green-400 mb-3" />
          <h3 className="text-xl font-semibold mb-1">all Chargers</h3>
          <p className="text-sm text-gray-400">
            Find available EV chargers near your current location.
          </p>
        </div>

        <div className="bg-white/10 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-green-500/20 transition">
          <FaUserCircle className="text-3xl text-green-400 mb-3" />
          <h3 className="text-xl font-semibold mb-1">Profile</h3>
          <p className="text-sm text-gray-400">
            Update your personal info and view your usage history.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EvOwnerDashboard;
