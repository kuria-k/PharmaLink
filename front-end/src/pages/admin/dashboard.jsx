import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '../../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, sales: 0, branches: 0 });
  const [branchSales, setBranchSales] = useState([]);
  const [userSales, setUserSales] = useState([]);
  const [chartMode, setChartMode] = useState("branch"); // branch | users

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, salesRes, branchesRes] = await Promise.all([
        api.get('/users/'),
        api.get('/sales/'),
        api.get('/branches/'),
      ]);

      const users = usersRes.data || [];
      const sales = salesRes.data || [];
      const branches = branchesRes.data || [];

      const totalUsers = users.length;
      const totalSales = sales.reduce((sum, s) => sum + parseFloat(s.total_amount || 0), 0);
      const totalBranches = branches.length;

      // ---------------------------
      // 1️⃣ Aggregate Sales Per Branch
      // ---------------------------
      const salesByBranch = {};
      sales.forEach((sale) => {
        const branch = sale.branch?.name || "Unknown";
        salesByBranch[branch] = (salesByBranch[branch] || 0) + parseFloat(sale.total_amount || 0);
      });

      const branchSalesData = branches.map((b) => ({
        name: b.name,
        total: salesByBranch[b.name] || 0
      }));

      // ---------------------------
      // 2️⃣ Aggregate Sales Per User
      // ---------------------------
      const salesByUser = {};
      sales.forEach((sale) => {
        const user = sale.user?.username || "Unknown";
        salesByUser[user] = (salesByUser[user] || 0) + parseFloat(sale.total_amount || 0);
      });

      const userSalesData = Object.keys(salesByUser).map((username) => ({
        username,
        total: salesByUser[username],
      }));

      setStats({ users: totalUsers, sales: totalSales, branches: totalBranches });
      setBranchSales(branchSalesData);
      setUserSales(userSalesData);

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  const currentLabels =
    chartMode === "branch"
      ? branchSales.map((b) => b.name)
      : userSales.map((u) => u.username);

  const currentData =
    chartMode === "branch"
      ? branchSales.map((b) => b.total)
      : userSales.map((u) => u.total);

  const chartData = {
    labels: currentLabels,
    datasets: [
      {
        label:
          chartMode === "branch"
            ? "Sales per Branch"
            : "Sales per User",
        data: currentData,
        backgroundColor: "#B57C36",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text:
          chartMode === "branch"
            ? "Sales per Branch"
            : "Sales per User",
        color: "#B57C36",
        font: { size: 20, weight: "bold" },
      },
    },
    scales: {
      y: {
        ticks: { color: "#333" },
        grid: { color: "#EEE" },
      },
      x: {
        ticks: { color: "#333", maxRotation: 60, minRotation: 30 },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-[#fff7f0] to-[#f0e6db] p-4 sm:p-8">

      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10">

        {/* HEADER */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#B57C36] mb-10 text-center">
          Admin Dashboard
        </h1>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Users" value={stats.users} />
          <StatCard title="Total Sales (KES)" value={stats.sales.toFixed(2)} />
          <StatCard title="Total Branches" value={stats.branches} />
        </div>

        {/* TOGGLE BUTTONS */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => setChartMode("branch")}
            className={`px-4 py-2 rounded-lg border ${
              chartMode === "branch"
                ? "bg-[#B57C36] text-white"
                : "bg-white border-[#B57C36] text-[#B57C36]"
            }`}
          >
            Branch Sales
          </button>

          <button
            onClick={() => setChartMode("users")}
            className={`px-4 py-2 rounded-lg border ${
              chartMode === "users"
                ? "bg-[#B57C36] text-white"
                : "bg-white border-[#B57C36] text-[#B57C36]"
            }`}
          >
            User Sales
          </button>
        </div>

        {/* CHART */}
        <div className="p-4 sm:p-6 bg-white border border-[#B57C36]/20 rounded-xl shadow-lg">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow-lg border border-[#B57C36]/20 rounded-xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition">
    <h2 className="text-[#B57C36] font-semibold text-lg sm:text-xl mb-1">{title}</h2>
    <p className="text-2xl sm:text-3xl font-bold">{value}</p>
  </div>
);

export default Dashboard;

