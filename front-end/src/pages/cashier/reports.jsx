import React, { useEffect, useState } from "react";
import { getPayments } from "../../utils/api";

const CashierReports = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getPayments().then((res) => setPayments(res.data));
  }, []);

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#B57C36] mb-4">Cashier Reports</h1>
      <p className="mb-4">Total Confirmed Payments: KES {totalPaid.toFixed(2)}</p>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#B57C36]/20">
            <th className="border p-2">Sale ID</th>
            <th className="border p-2">Mode</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.sale}</td>
              <td className="border p-2">{p.payment_mode}</td>
              <td className="border p-2">{p.status}</td>
              <td className="border p-2">{p.amount_paid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CashierReports;
