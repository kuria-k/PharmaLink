import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/users";
import Branches from "../pages/admin/Branches";

const AdminRoutes = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="branches" element={<Branches />} />
    </Route>
  </Routes>
);

export default AdminRoutes;

