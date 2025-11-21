// src/pages/sales/Reports.jsx
import React from "react";

const Reports = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-[#B57C36] mb-4">Sales Reports</h2>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass p-4 text-center">
        <h2 className="text-lg font-semibold text-[#B57C36]">Total Revenue</h2>
        <p className="text-2xl font-bold">$120,000</p>
      </div>
      <div className="glass p-4 text-center">
        <h2 className="text-lg font-semibold text-[#B57C36]">Profit</h2>
        <p className="text-2xl font-bold">$45,000</p>
      </div>
      <div className="glass p-4 text-center">
        <h2 className="text-lg font-semibold text-[#B57C36]">Top Customer</h2>
        <p className="text-2xl font-bold">Jane Smith</p>
      </div>
    </div>

    {/* Charts Placeholder */}
    <div className="glass p-6">
      <h2 className="text-xl font-bold text-[#B57C36] mb-4">Revenue Trends</h2>
      <div className="h-96 flex items-center justify-center text-gray-500">
        {/* Replace with Chart.js */}
        <span>📊 Chart Placeholder</span>
      </div>
    </div>

    {/* Export Buttons */}
    <div className="flex gap-4">
      <button className="bg-[#B57C36] text-white px-4 py-2 rounded-lg">Export PDF</button>
      <button className="bg-[#B57C36] text-white px-4 py-2 rounded-lg">Export CSV</button>
    </div>
  </div>
);

export default Reports;
