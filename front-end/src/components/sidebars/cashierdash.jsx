// components/sidebars/CashierSidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";

const CashierSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);

  // Get tabId for this browser tab
  const tabId = sessionStorage.getItem("tabId");

  useEffect(() => {
    if (tabId) {
      const storedUser = localStorage.getItem(`user-${tabId}`);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error("Error parsing user:", err);
        }
      }
    }
  }, [tabId]);

  const handleLogout = () => {
    if (tabId) {
      localStorage.removeItem(`role-${tabId}`);
      localStorage.removeItem(`user-${tabId}`);
      localStorage.removeItem(`accessToken-${tabId}`);
      localStorage.removeItem(`refreshToken-${tabId}`);
      localStorage.removeItem(`branches-${tabId}`);
    }
    navigate("/login");
  };

  // Cashier-specific navigation items
  const navItems = [
    { label: "Dashboard", path: "/cashier/dashboard" },
    { label: "Pending Payments", path: "/cashier/payments/pending" },
    { label: "Confirm Payment", path: "/cashier/payments/confirm" },
    { label: "M-Pesa STK", path: "/cashier/payments/mpesa" },
    { label: "Reports", path: "/cashier/reports" },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-[#B57C36] bg-white/30 backdrop-blur-md p-2 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white/30 backdrop-blur-md border-r border-[#B57C36] text-black p-6 shadow-xl z-40 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block`}
      >
        {/* Top section */}
        <div>
          <h2 className="text-xl font-bold mb-8 text-[#B57C36]">PharmaLink Cashier</h2>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`block px-4 py-2 rounded-lg font-medium transition duration-200 ${
                      isActive
                        ? "bg-[#B57C36] text-white shadow-md"
                        : "hover:text-[#B57C36] text-black"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
            <li>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full text-left px-4 py-2 rounded-lg font-medium hover:text-red-500 transition duration-200"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Bottom section: User info */}
        {user && (
          <div className="mt-70 bg-[#B57C36]/90 text-white rounded-lg p-4 shadow-lg flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-2">
              <FiUser size={24} />
            </div>
            <div>
              <p className="font-semibold">{user.username}</p>
              {user.role && <p className="text-xs opacity-90">Role: {user.role}</p>}
              {user.email && <p className="text-xs opacity-90">{user.email}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-xl p-6 w-[90%] max-w-md text-black">
            <h2 className="text-xl font-semibold text-center mb-4">Confirm Logout</h2>
            <p className="text-center text-gray-700 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-gray-300 rounded bg-white/60 hover:bg-white/80 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CashierSidebar;


