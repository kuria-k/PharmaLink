// src/pages/sales/Reports.jsx
import React, { useEffect, useState } from "react";
import { getSales, getCustomers } from "../../utils/api";

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, customersRes] = await Promise.all([
          getSales(),
          getCustomers(),
        ]);
        setSales(salesRes.data);
        setCustomers(customersRes.data);
      } catch (error) {
        console.error("Error fetching reports data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- KPI Calculations ---
  const totalUsers = customers.length;
  const totalSales = sales.length;

  // Top client by total sales amount
  const customerTotals = {};
  sales.forEach((sale) => {
    if (!customerTotals[sale.customer]) {
      customerTotals[sale.customer] = 0;
    }
    customerTotals[sale.customer] += sale.amount || 0;
  });

  const sortedClients = Object.entries(customerTotals).sort((a, b) => b[1] - a[1]);
  const topClient = sortedClients[0]?.[0] || "N/A";
  const topClientSales = sortedClients[0]?.[1] || 0;

  // Recent sales (last 5)
  const recentSales = sales.slice(-5).reverse();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-[#B57C36] mb-6">Sales Reports Dashboard</h2>

      {loading ? (
        <p className="text-gray-500">Loading reports...</p>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 text-center rounded-lg shadow">
              <h2 className="text-lg font-semibold text-[#B57C36]">Total Users</h2>
              <p className="text-3xl font-bold">{totalUsers}</p>
            </div>
            <div className="glass p-6 text-center rounded-lg shadow">
              <h2 className="text-lg font-semibold text-[#B57C36]">Total Sales</h2>
              <p className="text-3xl font-bold">{totalSales}</p>
            </div>
            <div className="glass p-6 text-center rounded-lg shadow">
              <h2 className="text-lg font-semibold text-[#B57C36]">Top Client</h2>
              <p className="text-2xl font-bold">{topClient}</p>
              <p className="text-sm text-gray-600">Sales: KSH{topClientSales.toFixed(2)}</p>
            </div>
          </div>

          {/* Top Clients Leaderboard */}
          <div className="glass p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-[#B57C36] mb-4">Top Clients by Sales</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#B57C36] text-white">
                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-left">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {sortedClients.slice(0, 3).map(([client, amount], idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{client}</td>
                    <td className="p-3">${amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Sales Activity */}
          <div className="glass p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-[#B57C36] mb-4">Recent Sales Activity</h2>
            <ul className="divide-y divide-gray-200 text-sm">
              {recentSales.map((sale, idx) => (
                <li key={idx} className="py-2 flex justify-between">
                  <span>{sale.customer}</span>
                  <span className="font-semibold">${sale.amount.toFixed(2)}</span>
                  <span className="text-gray-500">{sale.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;


