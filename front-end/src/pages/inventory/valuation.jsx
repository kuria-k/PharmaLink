import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Utility: format numbers as Kenyan Shillings
const formatCurrency = (value) =>
  `KSh ${value.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`;

const InventoryValuation = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 

  // Fetch product valuation data from backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/inventory/products/valuation/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching valuation data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading inventory valuation...</div>;
  }

  // Filter products by search term (name or SKU)
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Totals (based on filtered products)
  const totalCostValue = filteredProducts.reduce(
    (sum, p) => sum + p.costPrice * p.quantity,
    0
  );
  const totalSellingValue = filteredProducts.reduce(
    (sum, p) => sum + p.sellingPrice * p.quantity,
    0
  );
  const profitPotential = totalSellingValue - totalCostValue;

  // Chart data (based on filtered products)
  const chartData = {
    labels: filteredProducts.map((p) => p.name),
    datasets: [
      {
        label: "Cost Value",
        data: filteredProducts.map((p) => p.costPrice * p.quantity),
        backgroundColor: "rgba(181, 124, 54, 0.6)", 
      },
      {
        label: "Selling Value",
        data: filteredProducts.map((p) => p.sellingPrice * p.quantity),
        backgroundColor: "rgba(54, 162, 235, 0.6)", 
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#B57C36" } },
      title: {
        display: true,
        text: "Inventory Valuation Breakdown",
        color: "#B57C36",
        font: { size: 18 },
      },
    },
    scales: {
      x: { ticks: { color: "#B57C36" } },
      y: { ticks: { color: "#B57C36" } },
    },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass p-6">
        <h1 className="text-3xl font-bold text-[#B57C36]">Inventory Valuation</h1>
        <p className="mt-2 text-gray-700">
          Live stock valuation from your database in Kenyan Shillings.
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass p-4">
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Total Cost Value</h2>
          <p className="text-2xl font-bold">{formatCurrency(totalCostValue)}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Total Selling Value</h2>
          <p className="text-2xl font-bold">{formatCurrency(totalSellingValue)}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Profit Potential</h2>
          <p className="text-2xl font-bold">{formatCurrency(profitPotential)}</p>
        </div>
      </div>

      {/* Valuation Table */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Product Valuation</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#B57C36]/20 text-[#B57C36]">
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Cost Price</th>
              <th className="p-3 text-left">Selling Price</th>
              <th className="p-3 text-left">Cost Value</th>
              <th className="p-3 text-left">Selling Value</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.sku}</td>
                <td className="p-3">{p.quantity}</td>
                <td className="p-3">{formatCurrency(p.costPrice)}</td>
                <td className="p-3">{formatCurrency(p.sellingPrice)}</td>
                <td className="p-3">{formatCurrency(p.costPrice * p.quantity)}</td>
                <td className="p-3">{formatCurrency(p.sellingPrice * p.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Valuation Breakdown</h2>
        <div className="h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default InventoryValuation;





