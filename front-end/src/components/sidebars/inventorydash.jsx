import React from 'react';
import { Link } from 'react-router-dom';

const InventorySidebar = () => (
  <div className="w-64 h-screen fixed bg-white/30 backdrop-blur-md border-r border-[#B57C36] text-black p-6 shadow-xl">
    <h2 className="text-xl font-bold mb-8 text-[#B57C36]">Inventory Panel</h2>
    <ul className="space-y-4">
      <li><Link to="/inventory/dashboard" className="hover:text-[#B57C36] font-medium">Dashboard</Link></li>
      <li><Link to="/inventory/products" className="hover:text-[#B57C36] font-medium">Products</Link></li>
      <li><Link to="/inventory/stock" className="hover:text-[#B57C36] font-medium">Stock Levels</Link></li>
      <li><Link to="/inventory/reorders" className="hover:text-[#B57C36] font-medium">Reorder Alerts</Link></li>
      <li><Link to="/inventory/suppliers" className="hover:text-[#B57C36] font-medium">Suppliers</Link></li>
      <li><Link to="/inventory/logs" className="hover:text-[#B57C36] font-medium">Inventory Logs</Link></li>
    </ul>
  </div>
);

export default InventorySidebar;
