import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
    } else {
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold text-center text-blue-700 mb-4">
              My Profile
            </h1>

            {user ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-blue-50 p-3 rounded-xl shadow-sm">
                  <p className="text-gray-700 font-medium">Name:</p>
                  <p className="text-gray-900 font-semibold">{user.username}</p>
                </div>

                <div className="flex justify-between items-center bg-blue-50 p-3 rounded-xl shadow-sm">
                  <p className="text-gray-700 font-medium">Email:</p>
                  <p className="text-gray-900 font-semibold">{user.email}</p>
                </div>

                <div className="flex justify-between items-center bg-blue-50 p-3 rounded-xl shadow-sm">
                  <p className="text-gray-700 font-medium">Role:</p>
                  <p className="text-gray-900 font-semibold capitalize">{user.role}</p>
                </div>

                <Button
                  onClick={() => {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    localStorage.removeItem("user");
                    navigate("/login");
                  }}
                  className="w-full text-lg mt-4 rounded-xl shadow-md"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <p className="text-center text-gray-600">Loading...</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
