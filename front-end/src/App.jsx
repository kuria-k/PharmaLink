// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/home";
// import AdminLogin from "./pages/auth/adminlogin";
// import AdminRoutes from "./routes/adminroutes";
// import InventoryRoutes from "./routes/inventoryroutes";

// const App = () => {
//   const isAdmin = localStorage.getItem("isAdmin") === "true";
//   const isInventory = localStorage.getItem("isInventory") === "true";

//   return (
//     <Router>
//       <Routes>
//         {/* Public routes */}
//          <Route path="/" element={<Home />} />
//          <Route path="/admin/login" element={<AdminLogin />} />

//         {/* Protected routes */}
//         {isAdmin && <Route path="/admin/*" element={<AdminRoutes />} />}
//         {isInventory && <Route path="/inventory/*" element={<InventoryRoutes />} />}
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Home from "./pages/home";
import AdminLogin from "./pages/auth/adminlogin";
import AdminRoutes from "./routes/adminroutes";
import InventoryRoutes from "./routes/inventoryroutes";
import SalesRoutes from "./routes/salesroutes";
import CashierRoutes from "./routes/cashierroutes";

// Generate or reuse a tabId
const getTabId = () => {
  let id = sessionStorage.getItem("tabId");
  if (!id) {
    id = Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem("tabId", id);
  }
  return id;
};

const RoleGuard = ({ role, children }) => {
  const location = useLocation();
  if (!role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const App = () => {
  const tabId = getTabId();

  const [role, setRole] = useState(
    localStorage.getItem(`role-${tabId}`) || null
  );
  const [loadingRole, setLoadingRole] = useState(false);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === `role-${tabId}`) {
        setRole(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [tabId]);

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<AdminLogin setRole={setRole} setLoadingRole={setLoadingRole} tabId={tabId} />}
        />

        {/* Protected */}
        <Route
          path="/admin/*"
          element={
            <RoleGuard role={role === "admin"}>
              <AdminRoutes />
            </RoleGuard>
          }
        />
        <Route
          path="/inventory/*"
          element={
            <RoleGuard role={role === "inventory"}>
              <InventoryRoutes />
            </RoleGuard>
          }
        />
        <Route
          path="/sales/*"
          element={
            <RoleGuard role={role === "sales"}>
              <SalesRoutes />
            </RoleGuard>
          }
        />
        <Route
          path="/cashier/*"
          element={
            <RoleGuard role={role === "cashier"}>
              <CashierRoutes />
            </RoleGuard>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Splash */}
      {loadingRole && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white/90 rounded-xl p-8 shadow-xl text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="animate-spin h-10 w-10 text-[#B57C36]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#B57C36]">
              Redirecting to {role || "your"} dashboard...
            </h2>
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/home";
// import AdminLogin from "./pages/auth/adminlogin";
// import AdminRoutes from "./routes/adminroutes";
// import InventoryRoutes from "./routes/inventoryroutes";

// const App = () => {
//   const isAdmin = localStorage.getItem("isAdmin") === "true";

//   return (
//     <Router>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/admin/login" element={<AdminLogin />} />

//         {/* Admin protected routes */}
//         {isAdmin && <Route path="/*" element={<AdminRoutes />} />}

//         {/* Inventory routes */}
//         <Route path="/inventory/*" element={<InventoryRoutes />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
