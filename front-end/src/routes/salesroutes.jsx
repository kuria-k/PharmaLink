// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import SalesLayout from "../layouts/saleslayout";
// import SalesDashboard from "../pages/sales/dashboard";
// import NewSale from "../pages/sales/sale";
// import Invoices from "../pages/sales/invoice";
// import Customers from "../pages/sales/customer";
// import Products from "../pages/sales/products";
// import Reports from "../pages/sales/reports";

// const SalesRoutes = () => (
//   <Routes>
//     <Route element={<SalesLayout />}>
//       <Route index element={<SalesDashboard />} /> 
//       <Route path="dashboard" element={<SalesDashboard />} />
//       <Route path="new" element={<NewSale />} />
//       <Route path="invoices" element={<Invoices />} />
//       <Route path="customers" element={<Customers />} />
//       <Route path="products" element={<Products />} />
//       <Route path="reports" element={<Reports />} />
//     </Route>
//   </Routes>
// );

// export default SalesRoutes;

import React from "react";
import { Routes, Route } from "react-router-dom";
import SalesLayout from "../layouts/saleslayout";
import SalesDashboard from "../pages/sales/dashboard";
import NewSale from "../pages/sales/sale";
import Invoices from "../pages/sales/invoice";
import Customers from "../pages/sales/customer";
import Products from "../pages/sales/products";
import Reports from "../pages/sales/reports";

const SalesRoutes = () => (
  <Routes>
    <Route element={<SalesLayout />}>
      <Route index element={<SalesDashboard />} /> 
      <Route path="dashboard" element={<SalesDashboard />} />
      <Route path="new" element={<NewSale />} />
      <Route path="invoices" element={<Invoices />} />
      <Route path="customers" element={<Customers />} />
      <Route path="products" element={<Products />} />
      <Route path="reports" element={<Reports />} />
    </Route>
  </Routes>
);

export default SalesRoutes;



