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


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AdminLogin from "./pages/auth/adminlogin";
import AdminRoutes from "./routes/adminroutes";
import InventoryRoutes from "./routes/inventoryroutes";

const App = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isInventory = localStorage.getItem("isInventory") === "true";

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected routes */}
        {isAdmin && <Route path="/admin/*" element={<AdminRoutes />} />}
        {isInventory && <Route path="/inventory/*" element={<InventoryRoutes />} />}
      </Routes>
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



