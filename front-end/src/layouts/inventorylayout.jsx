// // src/layouts/inventorylayout.jsx
// import React from "react";
// import { Outlet } from "react-router-dom";
// import InventorySidebar from "../components/sidebars/inventorydash"; 

// const InventoryLayout = () => {
//   return (
//     <div className="flex">
//       {/* Sidebar on the left */}
//       <InventorySidebar />
//       {/* Main content area */}
//       <div className="ml-64 w-full">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default InventoryLayout;

// layouts/InventoryLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
 import InventorySidebar from "../components/sidebars/inventorydash"; 

const InventoryLayout = () => {
  return (
    <div className="flex">
      <InventorySidebar />
      <div className="ml-64 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default InventoryLayout;

