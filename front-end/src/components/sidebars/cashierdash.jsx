import React from 'react';
import { Link } from 'react-router-dom';

const CashierSidebar = () => (
  <div className="w-64 h-screen fixed bg-white/30 backdrop-blur-md border-r border-[#B57C36] text-black p-6 shadow-xl">
    <h2 className="text-xl font-bold mb-8 text-[#B57C36]">Cashier Panel</h2>
    <ul className="space-y-4">
      <li><Link to="/cashier/dashboard" className="hover:text-[#B57C36] font-medium">Dashboard</Link></li>
      <li><Link to="/cashier/sale" className="hover:text-[#B57C36] font-medium">New Sale</Link></li>
      <li><Link to="/cashier/sales" className="hover:text-[#B57C36] font-medium">Sales History</Link></li>
      <li><Link to="/cashier/payments" className="hover:text-[#B57C36] font-medium">Payment Records</Link></li>
      <li><Link to="/cashier/receipts" className="hover:text-[#B57C36] font-medium">Receipts</Link></li>
      <li><Link to="/cashier/customers" className="hover:text-[#B57C36] font-medium">Customer Lookup</Link></li>
    </ul>
  </div>
);

export default CashierSidebar;
