import React, { useState, useEffect } from "react";
import {
  getSales,
  getCustomers,
} from "../../utils/api";

const SalesDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    revenue: 0,
    customers: 0,
    invoices: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesRes = await getSales();
        const customersRes = await getCustomers();

        const salesData = salesRes.data || [];
        const customersData = customersRes.data || [];

        // Calculate stats
        const totalSales = salesData.length;
        const revenue = salesData.reduce((sum, sale) => sum + (sale.amount || 0), 0);
        const invoices = salesData.filter((s) => s.invoice_number).length;

        setStats({
          totalSales,
          revenue,
          customers: customersData.length,
          invoices,
        });

        // Sort by date for recent sales
        const sortedSales = [...salesData].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setRecentSales(sortedSales.slice(0, 10)); // show last 10
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#B57C36]">Loading Sales Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#B57C36]">Sales Dashboard</h1>
          <p className="mt-2 text-gray-700">Track performance, revenue, and customer activity.</p>
        </div>
        <button className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-6 py-2 rounded-lg">
          + New Sale
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Total Sales</h2>
          <p className="text-2xl font-bold">{stats.totalSales}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Revenue</h2>
          <p className="text-2xl font-bold">Ksh {stats.revenue.toLocaleString()}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Customers</h2>
          <p className="text-2xl font-bold">{stats.customers}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Invoices</h2>
          <p className="text-2xl font-bold">{stats.invoices}</p>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Recent Sales</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#B57C36]/20 text-[#B57C36]">
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{sale.customer_name || "N/A"}</td>
                  <td className="p-3">{sale.product_name || "N/A"}</td>
                  <td className="p-3">Ksh {sale.amount}</td>
                  <td className="p-3">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="p-3">{sale.invoice_number || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-6 py-4 rounded-lg">
          View Reports
        </button>
        <button className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-6 py-4 rounded-lg">
          Manage Customers
        </button>
        <button className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-6 py-4 rounded-lg">
          Sales Products
        </button>
      </div>
    </div>
  );
};

export default SalesDashboard;


