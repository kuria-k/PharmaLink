import React, { useEffect, useState } from "react";
import { getInventorySummary } from "../../utils/api";

const InventoryDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getInventorySummary();
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  // Format inventory value in Kenyan Shillings
  const formattedValue = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(summary.inventory_value);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="glass p-6">
        <h1 className="text-3xl font-bold text-[#B57C36]">
          Inventory Dashboard
        </h1>
        <p className="mt-2 text-gray-700">
          Pharmacy stock overview and performance metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">
            Total Products
          </h2>
          <p className="text-2xl font-bold">{summary.total_products}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">
            Inventory Value
          </h2>
          <p className="text-2xl font-bold">{formattedValue}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">
            Low Stock Items
          </h2>
          <p className="text-2xl font-bold">{summary.low_stock_items}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6">
          <h2 className="text-xl font-bold text-[#B57C36] mb-4">
            Stock Trends
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/* Chart.js Line Chart Placeholder */}
            <span>Line chart here</span>
          </div>
        </div>
        <div className="glass p-6">
          <h2 className="text-xl font-bold text-[#B57C36] mb-4">
            Valuation Breakdown
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/* Chart.js Pie Chart Placeholder */}
            <span>Pie chart here</span>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="glass p-6 border-l-4 border-red-600 bg-red-50">
        <h2 className="text-xl font-bold text-red-700 mb-4">Critical Alerts</h2>
        {summary.low_stock_items > 0 ? (
          <ul className="space-y-2">
            {summary.low_stock_list.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between p-2 rounded-md bg-red-100 hover:bg-red-200"
              >
                <span className="font-semibold text-red-800">
                  {item.name} (SKU: {item.sku})
                </span>
                <span
                  className={`px-2 py-1 text-sm font-bold rounded-md ${
                    item.available === 0
                      ? "bg-red-600 text-white"
                      : item.available < 5
                      ? "bg-orange-500 text-white"
                      : "bg-yellow-400 text-black"
                  }`}
                >
                  {item.available} left
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-700 font-semibold">
            No critical alerts. All stock levels are healthy.
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-4 py-2 rounded-lg">
            Add Product
          </button>
          <button className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-4 py-2 rounded-lg">
            New Purchase Order
          </button>
          <button className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-4 py-2 rounded-lg">
            Generate Report
          </button>
          <button className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-4 py-2 rounded-lg">
            Manage Suppliers
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
