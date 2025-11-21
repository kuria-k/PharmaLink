// src/pages/sales/Invoices.jsx
import React, { useState, useEffect } from "react";
import { getSales, getSaleInvoice } from "../../utils/api";

const Invoices = () => {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [sales, setSales] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await getSales();
        setSales(response.data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };
    fetchSales();
  }, []);

  // ✅ Use "date" field from serializer
  const filteredInvoices = sales.filter(
    (sale) => sale.date >= startDate && sale.date <= endDate
  );

  const handleViewInvoice = async (sale) => {
    try {
      const response = await getSaleInvoice(sale.id); // /sales/<id>/
      setSelectedInvoice(response.data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  const handlePrint = () => {
    const printContents = document.getElementById("invoice-print").innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${selectedInvoice?.id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #333; }
            header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #B57C36; padding-bottom: 10px; margin-bottom: 20px; }
            header h1 { color: #B57C36; margin: 0; font-size: 28px; }
            .company-info { text-align: right; font-size: 14px; }
            section { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #B57C36; color: white; }
            .total { text-align: right; font-weight: bold; }
            footer { margin-top: 40px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6ec] to-white p-10">
      <div className="glass rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-[#B57C36] mb-6 tracking-wide">
          Sales Invoices
        </h2>

        {/* Filter Section */}
        <div className="flex gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-[#B57C36] mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-[#B57C36]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#B57C36] mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-[#B57C36]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg shadow-lg border">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#B57C36]/20 text-[#B57C36]">
                <th className="p-4 text-left">Invoice No</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-[#fdf6ec] transition">
                    <td className="p-4 font-semibold">{sale.id}</td>
                    <td className="p-4">{sale.customer}</td>
                    <td className="p-4">${Number(sale.amount).toFixed(2)}</td>
                    <td className="p-4">{sale.date}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          sale.status === 'Paid' ? 'bg-green-600' : 'bg-yellow-500'
                        }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-3">
                      <button
                        className="bg-[#B57C36] text-white px-4 py-2 rounded-lg shadow hover:opacity-90"
                        onClick={() => handleViewInvoice(sale)}
                      >
                        View
                      </button>
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:opacity-90"
                        onClick={() => {
                          handleViewInvoice(sale);
                          setTimeout(handlePrint, 300);
                        }}
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No invoices found for selected period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[700px] relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setSelectedInvoice(null)}
            >
              ✖
            </button>

            <div id="invoice-print">
              <header className="mb-4">
                <h1 className="text-2xl font-bold text-[#B57C36]">Invoice</h1>
                <div className="company-info text-sm mt-2">
                  <p>
                    <strong>Golden Coffee Ltd.</strong>
                  </p>
                  <p>123 Business Street</p>
                  <p>Nairobi, Kenya</p>
                  <p>Email: info@golden-coffee.com</p>
                </div>
              </header>

              <section className="mb-4 text-sm">
                <p>
                  <strong>Invoice No:</strong> {selectedInvoice.id}
                </p>
                <p>
                  <strong>Customer:</strong> {selectedInvoice.customer}
                </p>
                <p>
                  <strong>Date:</strong> {selectedInvoice.date}
                </p>
                <p>
                  <strong>Status:</strong> {selectedInvoice.status}
                </p>
              </section>

              <table className="w-full border-collapse mb-6 text-sm">
                <thead>
                  <tr className="bg-[#B57C36]/20 text-[#B57C36]">
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Qty</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{item.description}</td>
                      <td className="p-2">{item.qty}</td>
                      <td className="p-2">${Number(item.price).toFixed(2)}</td>
                      <td className="p-2">
                        ${Number(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="p-2 font-semibold text-right">
                      Grand Total
                    </td>
                    <td className="p-2 font-bold text-[#B57C36]">
                      ${Number(selectedInvoice.amount).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <footer className="text-sm text-gray-600">
                <p>Thank you for your business!</p>
                <p>Payment due within 14 days.</p>
              </footer>
            </div>

            {/* Modal Action Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="bg-[#B57C36] text-white px-4 py-2 rounded-lg shadow hover:opacity-90"
                onClick={handlePrint}
              >
                Print
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:opacity-90"
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Invoices;