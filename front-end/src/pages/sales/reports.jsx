// src/pages/sales/Reports.jsx
import React, { useEffect, useState } from "react";
import { getSales, getCustomers } from "../../utils/api";
import { FaUsers, FaShoppingCart, FaCrown } from "react-icons/fa";

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //  Pagination logic
  const totalPages = Math.ceil(sales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSales = sales.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, customersRes] = await Promise.all([
          getSales(),
          getCustomers(),
        ]);
        setSales(salesRes.data || []);
        setCustomers(customersRes.data || []);
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

  const customerTotals = {};
  sales.forEach((sale) => {
    const clientName = sale.customer_name || "Unknown";
    const amount = Number(sale.total_amount) || 0;
    customerTotals[clientName] = (customerTotals[clientName] || 0) + amount;
  });

  const sortedClients = Object.entries(customerTotals).sort((a, b) => b[1] - a[1]);
  const topClient = sortedClients[0]?.[0] || "N/A";
  const topClientSales = sortedClients[0]?.[1] || 0;

  const recentSales = [...sales]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-20 mt-10">
      <h2 className="text-4xl font-extrabold text-[#B57C36] mb-6 text-center">
        Sales Reports Dashboard
      </h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading reports...</p>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 text-center rounded-xl shadow-lg hover:scale-105 transition">
              <FaUsers className="text-3xl text-[#B57C36] mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-[#B57C36]">Total Users</h2>
              <p className="text-4xl font-bold">{totalUsers}</p>
            </div>
            <div className="glass p-6 text-center rounded-xl shadow-lg hover:scale-105 transition">
              <FaShoppingCart className="text-3xl text-[#B57C36] mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-[#B57C36]">Total Sales</h2>
              <p className="text-4xl font-bold">{totalSales}</p>
            </div>
            <div className="glass p-6 text-center rounded-xl shadow-lg hover:scale-105 transition">
              <FaCrown className="text-3xl text-[#B57C36] mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-[#B57C36]">Top Client</h2>
              <p className="text-2xl font-bold">{topClient}</p>
              <p className="text-sm text-gray-600">Sales: KSH {topClientSales.toFixed(2)}</p>
            </div>
          </div>

          {/* Top Clients Leaderboard */}
          <div className="glass p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-[#B57C36] mb-4"> Top Clients</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#B57C36] text-white">
                  <th className="p-3 text-left">Rank</th>
                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-left">Total Sales (KSH)</th>
                </tr>
              </thead>
              <tbody>
                {sortedClients.slice(0, 5).map(([client, amount], idx) => (
                  <tr
                    key={idx}
                    className={`border-b hover:bg-gray-50 transition ${
                      idx % 2 === 0 ? "bg-gray-100/50" : ""
                    }`}
                  >
                    <td className="p-3 font-bold">#{idx + 1}</td>
                    <td className="p-3">{client}</td>
                    <td className="p-3">{amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Sales Activity */}
           <div className="glass p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-[#B57C36] mb-4 flex items-center gap-2">
         Recent Sales
      </h2>

      <ul className="divide-y divide-gray-200 text-sm">
        {currentSales.map((sale, idx) => (
          <li
            key={idx}
            className="py-3 flex items-center justify-between hover:bg-gray-50 transition rounded-md px-2"
          >
            {/* Customer */}
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 bg-[#B57C36] rounded-full"></span>
              {sale.customer_name || "Unknown"}
            </span>

            {/* Amount */}
            <span className="font-semibold text-[#B57C36] bg-[#FFD580]/30 px-3 py-1 rounded-full">
              KSH {Number(sale.total_amount).toFixed(2)}
            </span>

            {/* Date */}
            <span className="text-gray-500 text-xs">{sale.date}</span>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i + 1
                ? "bg-[#B57C36] text-white font-bold"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
        </>
      )}
    </div>
  );
};

export default Reports;



