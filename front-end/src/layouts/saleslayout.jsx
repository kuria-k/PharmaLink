// src/layouts/SalesLayout.jsx
// import React from "react";
// import { Outlet } from "react-router-dom";
// import SalesSidebar from "../components/sidebars/salesdash";

// const SalesLayout = () => {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <SalesSidebar />

//       {/* Main Content */}
//       <div className="flex-1 ml-64 p-6">
//         {/* Optional Header */}
//         <header className="glass p-4 mb-6 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-[#B57C36]">Sales Management</h1>
//           <span className="text-gray-600">PharmaLink System</span>
//         </header>

//         {/* Dynamic routed content */}
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default SalesLayout;

import React from "react";
import { Outlet } from "react-router-dom";
import SalesSidebar from "../components/sidebars/salesdash"; 

const SalesLayout = () => {
  return (
    <div className="flex">
      <SalesSidebar />
      <div className="ml-64 w-full">
        <Outlet /> 
      </div>
    </div>
  );
};

export default SalesLayout;
