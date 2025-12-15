import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/sidebars/admindash";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Clear tokens/session
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("branches");

        // Show modal
        setShowModal(true);
      }, 1000 * 60 * 1000); //  1 minute
    };

    // Listen for user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    // Start timer initially
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  const handleRedirect = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 w-full">
        <Outlet />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div
            className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl 
                    bg-white/20 backdrop-blur-xl border border-white/30 
                    text-center animate-[fadeIn_0.3s_ease-out]"
          >
            {/* Header */}
            <h2 className="text-3xl font-extrabold text-[#ff4d4d] mb-4 drop-shadow">
              Session Expired
            </h2>

            {/* Message */}
            <p className="text-gray-100 mb-6 leading-relaxed">
              You have been inactive for{" "}
              <span className="font-semibold">1 minutes</span>. For your
              security, please log in again.
            </p>

            {/* Decorative Divider */}
            <div className="w-16 h-1 bg-[#FFD580] mx-auto mb-6 rounded-full"></div>

            {/* Action Button */}
            <button
              onClick={handleRedirect}
              className="bg-[#FFD580] hover:bg-[#e6c46d] text-black font-semibold 
                   py-2 px-8 rounded-lg shadow-lg transition duration-300 
                   transform hover:scale-105"
            >
              Re‑Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
