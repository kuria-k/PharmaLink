import React, { useEffect, useState } from "react";
import { getBatches, getInventorySummary } from "../../utils/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const InventoryDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, batchesRes] = await Promise.all([
          getInventorySummary(),
          getBatches(),
        ]);
        setSummary(summaryRes.data);
        setBatches(batchesRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!summary) {
    return <div className="p-6 text-red-600">No data available.</div>;
  }

  // Format inventory value in Kenyan Shillings
  const formattedValue = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(summary.inventory_value || 0);

  // Filter batches for the past 7 days
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const recentBatches = batches.filter((b) => {
    const batchDate = new Date(b.received); // <-- use 'received'
    return batchDate >= sevenDaysAgo && batchDate <= today;
  });

  // Group by date
  const dailyTotals = {};
  recentBatches.forEach((b) => {
    const date = new Date(b.received).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    dailyTotals[date] = (dailyTotals[date] || 0) + (b.quantity || 0); // <-- use 'quantity'
  });

  const lineLabels = Object.keys(dailyTotals);
  const lineValues = Object.values(dailyTotals);

  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: "Daily Batch Quantity (Past 7 Days)",
        data: lineValues,
        borderColor: "#B57C36",
        backgroundColor: "rgba(181, 124, 54, 0.3)",
        pointBackgroundColor: "#B57C36",
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { color: "#374151", font: { size: 14 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `Quantity: ${ctx.raw?.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Date", color: "#374151" },
        ticks: { color: "#6B7280", font: { size: 12 } },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Batch Quantity", color: "#374151" },
        ticks: { color: "#6B7280", font: { size: 12 } },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="glass p-6">
        <h1 className="text-3xl font-bold text-[#B57C36]">Inventory Dashboard</h1>
        <p className="mt-2 text-gray-700">
          Pharmacy stock overview and batching trends (past 7 days)
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Total Products</h2>
          <p className="text-2xl font-bold">{summary.total_products || 0}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Inventory Value</h2>
          <p className="text-2xl font-bold">{formattedValue}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Low Stock Items</h2>
          <p className="text-2xl font-bold">{summary.low_stock_items || 0}</p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Daily Batch Quantities (Past 7 Days)</h2>
        <div className="h-80">
          {lineLabels.length > 0 ? (
            <Line data={lineData} options={lineOptions} />
          ) : (
            <p className="text-gray-500">No batching data available for the past 7 days.</p>
          )}
        </div>
      </div>

      {/* Alerts Section */}
      <div className="glass p-6 border-l-4 border-red-600 bg-red-50">
        <h2 className="text-xl font-bold text-red-700 mb-4">Critical Alerts</h2>
        {summary.low_stock_items > 0 ? (
          <ul className="space-y-2">
            {summary.low_stock_list?.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between p-2 rounded-md bg-red-100 hover:bg-red-200 transition-colors"
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
      {/* <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {["Add Product", "New Purchase Order", "Generate Report", "Manage Suppliers"].map(
            (action, idx) => (
              <button
                key={idx}
                className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-4 py-2 rounded-lg shadow-md transition-transform hover:scale-105"
              >
                {action}
              </button>
            )
          )}
        </div>
      </div> */}
    </div>
  );
};

export default InventoryDashboard;
