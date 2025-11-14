import React from 'react';
import { Link } from 'react-router-dom';

const SalesSidebar = () => (
  <div className="w-64 h-screen fixed bg-white/30 backdrop-blur-md border-r border-[#B57C36] text-black p-6 shadow-xl">
    <h2 className="text-xl font-bold mb-8 text-[#B57C36]">Sales Panel</h2>
    <ul className="space-y-4">
      <li><Link to="/sales/dashboard" className="hover:text-[#B57C36] font-medium">Dashboard</Link></li>
      <li><Link to="/sales/reports" className="hover:text-[#B57C36] font-medium">Sales Reports</Link></li>
      <li><Link to="/sales/top-products" className="hover:text-[#B57C36] font-medium">Top Products</Link></li>
      <li><Link to="/sales/customers" className="hover:text-[#B57C36] font-medium">Customer Insights</Link></li>
      <li><Link to="/sales/promotions" className="hover:text-[#B57C36] font-medium">Promotions</Link></li>
      <li><Link to="/sales/export" className="hover:text-[#B57C36] font-medium">Export Data</Link></li>
    </ul>
  </div>
);

export default SalesSidebar;
