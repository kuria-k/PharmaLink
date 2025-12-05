import React, { useEffect, useState } from "react";
import { getPayments } from "../../utils/api";

const ConfirmedPayments = () => {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // number of rows per page

  useEffect(() => {
    getPayments("paid").then((res) => setPayments(res.data));
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = payments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  return (
    <div className="p-8 bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] min-h-screen">
      <h1 className="text-3xl font-extrabold text-[#B57C36] mb-6">Confirmed Payments</h1>

      <div className="overflow-hidden rounded-xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#B57C36]/30 text-gray-800">
              <th className="p-3">Invoice</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Mode</th>
              <th className="p-3">Receipt</th>
              <th className="p-3">Confirmed By</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">
                  No confirmed payments found.
                </td>
              </tr>
            ) : (
              currentPayments.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white/60" : "bg-white/40"
                  } hover:bg-[#B57C36]/10 transition-colors`}
                >
                  <td className="p-3">{p.sale?.invoice_number}</td>
                  <td className="p-3">{p.sale?.customer_name}</td>
                  <td className="p-3">KES {p.sale?.total_amount}</td>
                  <td className="p-3">{p.payment_mode}</td>
                  <td className="p-3">{p.mpesa_receipt || "N/A"}</td>
                  <td className="p-3">{p.confirmed_by || "System"}</td>
                  <td className="p-3 text-green-700 font-semibold">{p.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {payments.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-[#B57C36]/20 hover:bg-[#B57C36]/40 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-[#B57C36]/20 hover:bg-[#B57C36]/40 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfirmedPayments;


