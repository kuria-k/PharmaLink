import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AdminLogin from "./pages/auth/adminlogin";
import AdminRoutes from "./routes/adminroutes";

const App = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        {isAdmin && <Route path="/*" element={<AdminRoutes />} />}
      </Routes>
    </Router>
  );
};

export default App;


