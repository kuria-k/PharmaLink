import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../../utils/api";
import {
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaMobileAlt,
  FaWallet,
  FaCreditCard,
} from "react-icons/fa";

// Chart.js imports
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CashierDashboard = () => {
  const [stats, setStats] = useState({
    total_sales: 0,
    pending_payments: 0,
    confirmed_payments: 0,
    mpesa_total: 0,
    cash_total: 0,
    card_total: 0,
  });

  useEffect(() => {
    getDashboardStats().then((res) => setStats(res.data));
  }, []);

  const Card = ({ title, value, icon, color }) => (
    <div className="p-6 rounded-2xl shadow-lg backdrop-blur-md bg-white/20 border border-white/30 transition transform hover:scale-105">
      <div className="flex items-center space-x-4">
        <div className={`text-3xl ${color}`}>{icon}</div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  // Chart data for payment breakdown
  const paymentData = {
    labels: ["M-Pesa", "Cash", "Card"],
    datasets: [
      {
        label: "Payments (KES)",
        data: [stats.mpesa_total, stats.cash_total, stats.card_total],
        backgroundColor: ["#22c55e", "#facc15", "#3b82f6"],
      },
    ],
  };

  // Sales progress bar target
  const target = 200000;
  const percentage = Math.min((stats.total_sales / target) * 100, 100);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]">
      <h1 className="text-3xl font-extrabold text-[#B57C36] mb-2">
        Cashier Dashboard
      </h1>
      <p className="text-gray-700 mb-8">
        Daily reconciliation summary with live sales and payments data
      </p>

      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          title="Total Sales"
          value={`KES ${stats.total_sales}`}
          icon={<FaMoneyBillWave />}
          color="text-[#B57C36]"
        />
        <Card
          title="Pending Payments"
          value={stats.pending_payments}
          icon={<FaClock />}
          color="text-yellow-500"
        />
        <Card
          title="Confirmed Payments"
          value={stats.confirmed_payments}
          icon={<FaCheckCircle />}
          color="text-green-600"
        />
      </div>

      {/* Payment breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          title="M-Pesa Payments"
          value={`KES ${stats.mpesa_total}`}
          icon={<FaMobileAlt />}
          color="text-green-500"
        />
        <Card
          title="Cash Payments"
          value={`KES ${stats.cash_total}`}
          icon={<FaWallet />}
          color="text-yellow-600"
        />
        <Card
          title="Card Payments"
          value={`KES ${stats.card_total}`}
          icon={<FaCreditCard />}
          color="text-blue-600"
        />
      </div>

      {/* NEW: Payment Method Breakdown Chart */}
      <div className="mt-12 bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-[#B57C36] mb-4">
          Payment Method Breakdown
        </h2>
        <Bar data={paymentData} />
      </div>

      {/* NEW: Sales Progress Bar with Percentage */}
      <div className="mt-12 bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-[#B57C36] mb-4">
          Daily Sales Target
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-6">
          <div
            className="bg-[#B57C36] h-6 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="mt-2 text-gray-700">
          {`KES ${stats.total_sales} / KES ${target} `}
          <span className="font-bold text-[#B57C36]">
            ({percentage.toFixed(1)}%)
          </span>
        </p>
      </div>
    </div>
  );
};

export default CashierDashboard;
