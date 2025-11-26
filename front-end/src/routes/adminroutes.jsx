import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout";
import Dashboard from "../pages/admin/dashboard";
import Users from "../pages/admin/users";
import Branches from "../pages/admin/branches";

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

