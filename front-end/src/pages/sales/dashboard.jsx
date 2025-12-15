import React, { useState, useEffect } from "react";
import { getSales, getCustomers } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { Receipt, User, CalendarDays } from "lucide-react";

const SalesDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    revenue: 0,
    registeredCustomers: 0,
    activeCustomers: 0,
    invoices: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesRes = await getSales();
        const customersRes = await getCustomers();

        const salesData = salesRes.data || [];
        const customersData = customersRes.data || [];

        // --- Stats ---
        const totalSales = salesData.length;

        const revenue = salesData.reduce(
          (sum, sale) => sum + (Number(sale.total_amount) || 0),
          0
        );

        const invoices = salesData.filter((s) => s.invoice_number).length;

        // Registered customers = all customers in DB
        const registeredCustomers = customersData.length;

        // Active customers = unique names from sales
        const activeCustomers = new Set(
          salesData.map((s) => s.customer_name).filter(Boolean)
        ).size;

        setStats({
          totalSales,
          revenue,
          registeredCustomers,
          activeCustomers,
          invoices,
        });

        // --- Recent Sales ---
        const sortedSales = [...salesData].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setRecentSales(sortedSales.slice(0, 10));
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
        <h1 className="text-2xl font-bold text-[#B57C36]">
          Loading Sales Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#B57C36]">Sales Dashboard</h1>
          <p className="mt-2 text-gray-700">
            Track performance, revenue, and customer activity.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Total Sales</h2>
          <p className="text-2xl font-bold">{stats.totalSales}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Revenue</h2>
          <p className="text-2xl font-bold">
            Ksh {stats.revenue.toLocaleString()}
          </p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Registered Clients</h2>
          <p className="text-2xl font-bold">{stats.registeredCustomers}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Active Clients</h2>
          <p className="text-2xl font-bold">{stats.activeCustomers}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Invoices</h2>
          <p className="text-2xl font-bold">{stats.invoices}</p>
        </div>
      </div>

      {/* Recent Sales Table */}
     <div className="relative rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-[#B57C36] flex items-center gap-2">
          <Receipt className="w-6 h-6" />
          Recent Sales
        </h2>
        <span className="text-sm text-gray-500">
          Last {recentSales.length} transactions
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-[#B57C36]/20 to-[#B57C36]/10 text-[#B57C36]">
              <th className="p-4 text-left font-semibold">Invoice</th>
              <th className="p-4 text-left font-semibold">Customer</th>
              <th className="p-4 text-left font-semibold">Total</th>
              <th className="p-4 text-left font-semibold">Date</th>
            </tr>
          </thead>

          <tbody>
            {recentSales.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                  No recent sales yet 🚀
                </td>
              </tr>
            ) : (
              recentSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="group border-b border-gray-100 hover:bg-[#B57C36]/5 transition-all duration-200"
                >
                  {/* Invoice */}
                  <td className="p-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#B57C36]/10 text-[#B57C36] font-medium">
                      {sale.invoice_number || "—"}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#B57C36] to-[#8a5a2b] text-white flex items-center justify-center font-bold uppercase">
                        {(sale.customer_name || "W")[0]}
                      </div>
                      <span className="font-medium text-gray-700">
                        {sale.customer_name || "Walk-in Customer"}
                      </span>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="p-4 font-semibold text-gray-900">
                    Ksh{" "}
                    <span className="text-lg">
                      {Number(sale.total_amount).toLocaleString()}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="p-4 text-gray-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-[#B57C36]" />
                      {new Date(sale.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

      {/* Quick Actions */}
      {/* <div className="glass p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-6 py-4 rounded-lg">
          View Reports
        </button>
        <button className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-6 py-4 rounded-lg">
          Manage Customers
        </button>
        <button className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-6 py-4 rounded-lg">
          Sales Products
        </button>
      </div> */}
    </div>
  );
};

export default SalesDashboard;
