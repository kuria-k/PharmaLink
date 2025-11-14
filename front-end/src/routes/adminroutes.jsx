import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/adminlayout';
import Dashboard from '../pages/admin/Dashboard';
import Users from "../pages/admin/users";
import Branches from '../pages/admin/Branches';

const AdminRoutes = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/branches" element={<Branches />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
