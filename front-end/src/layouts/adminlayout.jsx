import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from "../components/sidebars/admindash"; 

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
