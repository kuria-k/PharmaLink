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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // ✅ Hit your Django API endpoints
      const [usersRes, salesRes, branchesRes] = await Promise.all([
        api.get('/users/'),       // returns list of users
        api.get('/sales/'),       // returns list of sales { total_amount, branch }
        api.get('/branches/'),    // returns list of branches { name }
      ]);

      // ✅ Totals
      const totalUsers = Array.isArray(usersRes.data) ? usersRes.data.length : 0;
      const totalSales = Array.isArray(salesRes.data)
        ? salesRes.data.reduce((sum, s) => sum + parseFloat(s.total_amount || 0), 0)
        : 0;
      const totalBranches = Array.isArray(branchesRes.data) ? branchesRes.data.length : 0;

      // ✅ Aggregate sales per branch
      const salesByBranch = {};
      if (Array.isArray(salesRes.data)) {
        salesRes.data.forEach((sale) => {
          const branchName = sale.branch?.name || 'Unknown';
          salesByBranch[branchName] =
            (salesByBranch[branchName] || 0) + parseFloat(sale.total_amount || 0);
        });
      }

      const branchSalesData = Array.isArray(branchesRes.data)
        ? branchesRes.data.map((branch) => ({
            name: branch.name,
            total: salesByBranch[branch.name] || 0,
          }))
        : [];

      // ✅ Update state
      setStats({ users: totalUsers, sales: totalSales, branches: totalBranches });
      setBranchSales(branchSalesData);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const chartData = {
    labels: branchSales.map((b) => b.name),
    datasets: [
      {
        label: 'Total Sales (KES)',
        data: branchSales.map((b) => b.total),
        backgroundColor: '#B57C36',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Yearly Sales per Branch',
        color: '#B57C36',
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { color: '#333', autoSkip: false },
      },
      y: {
        ticks: { color: '#333' },
      },
    },
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-white via-white/80 to-white/60 px-4 py-8 sm:px-6 lg:px-12">
      <div className="w-full max-w-6xl bg-white/90 rounded-xl shadow-xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#B57C36] mb-8 text-center">
          Admin Dashboard
        </h1>

        {/* ✅ Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card
            title="Total Users"
            value={stats.users}
            className="bg-[#FDF6F0] border border-[#B57C36]/30 shadow-md hover:shadow-lg transition rounded-xl p-6 text-center"
          />
          <Card
            title="Total Sales (KES)"
            value={stats.sales.toFixed(2)}
            className="bg-[#FDF6F0] border border-[#B57C36]/30 shadow-md hover:shadow-lg transition rounded-xl p-6 text-center"
          />
          <Card
            title="Total Branches"
            value={stats.branches}
            className="bg-[#FDF6F0] border border-[#B57C36]/30 shadow-md hover:shadow-lg transition rounded-xl p-6 text-center"
          />
        </div>

        {/* ✅ Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, className }) => (
  <div className={`bg-white/30 backdrop-blur-md border border-[#B57C36] rounded-xl p-6 shadow-lg text-center ${className}`}>
    <h2 className="text-base sm:text-lg font-semibold text-[#B57C36] mb-2">{title}</h2>
    <p className="text-2xl sm:text-3xl font-bold text-black">{value}</p>
  </div>
);

export default Dashboard;
