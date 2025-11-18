// src/routes/inventoryroutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import InventoryLayout from "../layouts/inventorylayout"; 
import InventoryDashboard from "../pages/inventory/dashboard";
import StockTracking from "../pages/inventory/stocktracking";
import BatchExpiry from "../pages/inventory/batchexpiry";
import PurchaseOrders from "../pages/inventory/purchaseorder";
import InventoryValuation from "../pages/inventory/valuation";
import AddInventoryForm from "../pages/inventory/adding";
import Suppliers from "../pages/inventory/suppliers";

const InventoryRoutes = () => (
  <Routes>
    <Route element={<InventoryLayout />}>
      <Route path="dashboard" element={<InventoryDashboard />} />
      <Route path="stock" element={<StockTracking />} />
      <Route path="batch-expiry" element={<BatchExpiry />} />
      <Route path="purchase-orders" element={<PurchaseOrders />} />
      <Route path="valuation" element={<InventoryValuation />} />
      <Route path="add" element={<AddInventoryForm />} />
      <Route path="suppliers" element={<Suppliers />} />
    </Route>
  </Routes>
);

export default InventoryRoutes;

