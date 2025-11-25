import React, { useEffect, useState } from "react";
import { getPayments } from "../../utils/api";

const ConfirmedPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getPayments("paid").then((res) => setPayments(res.data));
  }, []);

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
            {payments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">
                  No confirmed payments found.
                </td>
              </tr>
            ) : (
              payments.map((p, idx) => (
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
    </div>
  );
};

export default ConfirmedPayments;

