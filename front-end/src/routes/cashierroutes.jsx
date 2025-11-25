import React from "react";
import { Routes, Route } from "react-router-dom";
import CashierLayout from "../layouts/cashierlayout";
import CashierDashboard from "../pages/cashier/dashboard";
import PendingPayments from "../pages/cashier/pendings";
import ConfirmPayment from "../pages/cashier/confirmed";
import MpesaTransactions from "../pages/cashier/mpesa";
import CashierReports from "../pages/cashier/reports";

const CashierRoutes = () => (
  <Routes>
    <Route element={<CashierLayout />}>
      <Route path="dashboard" element={<CashierDashboard />} />
      <Route path="payments/pending" element={<PendingPayments />} />
      <Route path="payments/confirm" element={<ConfirmPayment />} />
      <Route path="payments/mpesa" element={<MpesaTransactions />} />
      <Route path="reports" element={<CashierReports />} />
    </Route>
  </Routes>
);

export default CashierRoutes;
