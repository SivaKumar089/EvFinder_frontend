import { FaPlug, FaChartLine, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const EvChargerDashboard = () => {
  const navigate=useNavigate()


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-400 flex items-center gap-2">
          <FaPlug /> Charger Owner Dashboard
        </h1>
        <FaUsers className="text-4xl text-gray-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-green-500/20 transition" onClick={()=>navigate('/evstations')}>
          <FaChartLine className="text-3xl text-green-400 mb-3" />
          <h3 className="text-xl font-semibold mb-1">Usage Analytics</h3>
          <p className="text-sm text-gray-400">
            Monitor charger performance and revenue in real-time.
          </p>
        </div>

        <div className="bg-white/10 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-green-500/20 transition" onClick={()=> navigate('/Stations')}>
          <FaPlug className="text-3xl text-green-400 mb-3" />
          <h3 className="text-xl font-semibold mb-1">Manage Chargers</h3>
          <p className="text-sm text-gray-400">
            Add, update or deactivate your charging stations.
          </p>
        </div>
        <div className="bg-white/10 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-green-500/20 transition" onClick={()=> navigate('/summary')}>
          <FaPlug className="text-3xl text-green-400 mb-3" />
          <h3 className="text-xl font-semibold mb-1">Bookings</h3>
          <p className="text-sm text-gray-400">
            
          </p>
        </div>
       


      </div>
    </div>
  );
};

export default EvChargerDashboard;
