// // src/pages/sales/Invoices.jsx
// import React, { useState, useEffect } from "react";
// import { getSales, getSaleInvoice } from "../../utils/api";
// import { useNavigate } from "react-router-dom";

// const Invoices = () => {
//   const today = new Date().toISOString().split("T")[0];
//   const [startDate, setStartDate] = useState(today);
//   const [endDate, setEndDate] = useState(today);
//   const [sales, setSales] = useState([]);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSales = async () => {
//       try {
//         const response = await getSales();
//         console.log("Sales API response:", response.data);
//         setSales(response.data);
//       } catch (error) {
//         console.error(
//           "Error fetching sales:",
//           error.response?.data || error.message
//         );
//       }
//     };
//     fetchSales();
//   }, []);

//   //  Use "date" field from serializer
//   const filteredInvoices = sales.filter(
//     (sale) => sale.date >= startDate && sale.date <= endDate
//   );

//   const handleViewInvoice = async (sale) => {
//     try {
//       const response = await getSaleInvoice(sale.id);
//       setSelectedInvoice(response.data);
//     } catch (error) {
//       console.error("Error fetching invoice:", error);
//     }
//   };

//   const handlePrint = () => {
//     const printContents = document.getElementById("invoice-print").innerHTML;
//     const printWindow = window.open("", "", "width=800,height=600");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice ${selectedInvoice?.invoice_number}</title>
//           <style>
//             body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #333; }
//             header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #B57C36; padding-bottom: 10px; margin-bottom: 20px; }
//             header h1 { color: #B57C36; margin: 0; font-size: 28px; }
//             .company-info { text-align: right; font-size: 14px; }
//             section { margin-bottom: 20px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
//             th { background: #B57C36; color: white; }
//             .total { text-align: right; font-weight: bold; }
//             footer { margin-top: 40px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px; }
//           </style>
//         </head>
//         <body>${printContents}</body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#fdf6ec] to-white p-10">
//       <div className="bg-white rounded-xl shadow-xl p-8">
//         <h2 className="text-3xl font-extrabold text-[#B57C36] mb-8 tracking-wide border-b pb-4">
//           Sales Invoices
//         </h2>

//         {/* Filter Section */}
//         <div className="flex flex-wrap gap-6 mb-8 items-end">
//           <button
//             onClick={() => navigate("/sales/new")}
//             className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-6 py-2 rounded-lg shadow transition"
//           >
//             + New Sale
//           </button>
//           <div>
//             <label className="block text-sm font-semibold text-[#B57C36] mb-1">
//               Start Date
//             </label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="border rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-[#B57C36]"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-[#B57C36] mb-1">
//               End Date
//             </label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="border rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-[#B57C36]"
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-hidden rounded-lg shadow-lg border bg-white">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-[#B57C36] text-white">
//                 <th className="p-4 text-left">Invoice No</th>
//                 <th className="p-4 text-left">Customer</th>
//                 <th className="p-4 text-left">Amount (KSH)</th>
//                 <th className="p-4 text-left">Date</th>
//                 <th className="p-4 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredInvoices.length > 0 ? (
//                 filteredInvoices.map((sale) => (
//                   <tr
//                     key={sale.id}
//                     className="border-b hover:bg-[#fdf6ec] transition-colors"
//                   >
//                     <td className="p-4 font-semibold">{sale.invoice_number}</td>
//                     <td className="p-4">{sale.customer_name}</td>
//                     <td className="p-4 text-[#B57C36] font-medium">
//                       KSH {Number(sale.total_amount || 0).toFixed(2)}
//                     </td>
//                     <td className="p-4">{sale.date}</td>
//                     <td className="p-4 flex gap-3">
//                       <button
//                         className="bg-[#B57C36] text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
//                         onClick={() => handleViewInvoice(sale)}
//                       >
//                         View
//                       </button>
//                       <button
//                         className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
//                         onClick={() => {
//                           handleViewInvoice(sale);
//                           setTimeout(handlePrint, 300);
//                         }}
//                       >
//                         Print
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={5} className="p-6 text-center text-gray-500">
//                     No invoices found for selected period
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Invoice Modal */}
//       {selectedInvoice && (
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//     <div className="bg-white rounded-xl shadow-2xl w-[800px] max-h-[90vh] flex flex-col relative">
//       {/* Close Button */}
//       <button
//         className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
//         onClick={() => setSelectedInvoice(null)}
//       >
//         ✖
//       </button>

//       {/* Scrollable Content */}
//       <div
//         id="invoice-print"
//         className="space-y-8 overflow-y-auto p-10 flex-1"
//       >
//         {/* Header */}
//         <header className="flex justify-between items-center border-b-2 border-[#B57C36] pb-4">
//           <h1 className="text-3xl font-bold text-[#B57C36] tracking-wide">
//             Invoice
//           </h1>
//           <div className="text-right text-sm leading-relaxed">
//             <p className="font-semibold text-gray-800">Pharmalink Ltd.</p>
//             <p>Health Plaza, Nairobi</p>
//             <p>Email: support@pharmalink.com</p>
//           </div>
//         </header>

//         {/* Invoice Details */}
//         <section className="grid grid-cols-2 gap-6 text-sm">
//           <div className="space-y-2">
//             <p>
//               <span className="font-semibold">Invoice No:</span>{" "}
//               {selectedInvoice.invoice_number}
//             </p>
//             <p>
//               <span className="font-semibold">Customer:</span>{" "}
//               {selectedInvoice.customer_name}
//             </p>
//           </div>
//           <div className="space-y-2 text-right">
//             <p>
//               <span className="font-semibold">Date:</span>{" "}
//               {selectedInvoice.date}
//             </p>
//           </div>
//         </section>

//         {/* Items Table */}
//         <div className="overflow-x-auto">
//   <table className="w-full border-collapse text-sm">
//     <thead>
//       <tr className="bg-[#B57C36] text-white">
//         <th className="p-3 text-left">Product</th>
//         <th className="p-3 text-left">Qty</th>
//         <th className="p-3 text-left">Unit</th>
//         <th className="p-3 text-left">Price (KSH)</th>
//         <th className="p-3 text-left">Discount (%)</th>
//         <th className="p-3 text-left">VAT (%)</th>
//         <th className="p-3 text-left">Line Total (KSH)</th>
//       </tr>
//     </thead>
//     <tbody>
//       {selectedInvoice.items?.map((item, idx) => {
//         const subtotal = Number(item.quantity || 0) * Number(item.price || 0);
//         const discountAmount = subtotal * (Number(item.discount || 0) / 100);
//         const vatAmount = (subtotal - discountAmount) * (Number(item.vat || 0) / 100);
//         const lineTotal = subtotal - discountAmount + vatAmount;

//         return (
//           <tr key={idx} className="border-b hover:bg-gray-50">
//             <td className="p-3">{item.product_name}</td>
//             <td className="p-3">{item.quantity}</td>
//             <td className="p-3">{item.unit}</td>
//             <td className="p-3">
//               KSH {Number(item.price || 0).toFixed(2)}
//             </td>
//             <td className="p-3">{Number(item.discount || 0).toFixed(2)}%</td>
//             <td className="p-3">{Number(item.vat || 0).toFixed(2)}%</td>
//             <td className="p-3 font-semibold text-[#B57C36]">
//               KSH {lineTotal.toFixed(2)}
//             </td>
//           </tr>
//         );
//       })}
//       <tr className="bg-gray-100 font-semibold">
//         <td colSpan={6} className="p-3 text-right">
//           Grand Total
//         </td>
//         <td className="p-3 font-bold text-[#B57C36]">
//           KSH {Number(selectedInvoice.total_amount || 0).toFixed(2)}
//         </td>
//       </tr>
//     </tbody>
//   </table>
// </div>

//         {/* Signature Section */}
//         <div className="mt-8">
//           <h3 className="text-lg font-bold text-[#B57C36] mb-2">
//             Client Confirmation
//           </h3>
//           <p>
//             <strong>Name:</strong> ____________________________
//           </p>
//           <p>
//             <strong>Signature:</strong> ________________________
//           </p>
//           <p>
//             <strong>Date Received:</strong> ____________________
//           </p>
//         </div>

//         {/* Footer */}
//         <footer className="border-t pt-4 text-center text-xs text-gray-500 mt-8">
//           <p>
//             Thank you for choosing Pharmalink. Please keep this invoice for your
//             records.
//           </p>
//         </footer>
//       </div>

//       {/* Modal Action Buttons (fixed at bottom) */}
//       <div className="p-6 border-t flex justify-end gap-3">
//         <button
//           className="bg-[#B57C36] text-white px-5 py-2 rounded-lg shadow hover:bg-[#9E6B2F] transition"
//           onClick={handlePrint}
//         >
//           Print
//         </button>
//         <button
//           className="bg-gray-500 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-700 transition"
//           onClick={() => setSelectedInvoice(null)}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// export default Invoices;

// src/pages/sales/Invoices.jsx
import React, { useState, useEffect } from "react";
import { getSales, getSaleInvoice } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [sales, setSales] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await getSales();

        // 🔹 ADD date field derived from created_at (NO REMOVALS)
        const normalizedSales = response.data.map((sale) => ({
          ...sale,
          date: sale.created_at ? sale.created_at.split("T")[0] : "",
        }));

        console.log("Sales API response:", normalizedSales);
        setSales(normalizedSales);
      } catch (error) {
        console.error(
          "Error fetching sales:",
          error.response?.data || error.message
        );
      }
    };
    fetchSales();
  }, []);

  // ✅ NOW THIS WORKS (date EXISTS)
  const filteredInvoices = sales.filter(
    (sale) => sale.date >= startDate && sale.date <= endDate
  );

  const handleViewInvoice = async (sale) => {
    try {
      const response = await getSaleInvoice(sale.id);

      // 🔹 ALSO NORMALIZE MODAL DATA
      const invoiceData = {
        ...response.data,
        date: response.data.created_at
          ? response.data.created_at.split("T")[0]
          : "",
      };

      setSelectedInvoice(invoiceData);
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
          <title>Invoice ${selectedInvoice?.invoice_number}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #333; }
            header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #B57C36; padding-bottom: 10px; margin-bottom: 20px; }
            header h1 { color: #B57C36; margin: 0; font-size: 28px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; }
            th { background: #B57C36; color: white; }
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
      <div className="bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-[#B57C36] mb-8 border-b pb-4">
          Sales Invoices
        </h2>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-6 mb-8 items-end">
          <button
            onClick={() => navigate("/sales/new")}
            className="bg-[#B57C36] text-white px-6 py-2 rounded-lg shadow"
          >
            + New Sale
          </button>

          <div>
            <label className="block text-sm font-semibold text-[#B57C36] mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-2"
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
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg shadow-lg border bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#B57C36] text-white">
                <th className="p-4 text-left">Invoice No</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Amount (KSH)</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((sale) => (
                  <tr key={sale.id} className="border-b">
                    <td className="p-4 font-semibold">{sale.invoice_number}</td>
                    <td className="p-4">{sale.customer_name}</td>
                    <td className="p-4 text-[#B57C36] font-medium">
                      KSH {Number(sale.total_amount || 0).toFixed(2)}
                    </td>
                    <td className="p-4">{sale.date}</td>
                    <td className="p-4 flex gap-3">
                      <button
                        className="bg-[#B57C36] text-white px-4 py-2 rounded"
                        onClick={() => handleViewInvoice(sale)}
                      >
                        View
                      </button>
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
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
                  <td colSpan={5} className="p-6 text-center text-gray-500">
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
          <div className="bg-white rounded-xl shadow-2xl w-[800px] max-h-[90vh] flex flex-col relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
              onClick={() => setSelectedInvoice(null)}
            >
              ✖
            </button>

            {/* Scrollable Content */}
            <div
              id="invoice-print"
              className="space-y-8 overflow-y-auto p-10 flex-1"
            >
              {/* Header */}
              <header className="flex justify-between items-center border-b-2 border-[#B57C36] pb-4">
                <h1 className="text-3xl font-bold text-[#B57C36] tracking-wide">
                  Invoice
                </h1>
                <div className="text-right text-sm leading-relaxed">
                  <p className="font-semibold text-gray-800">Pharmalink Ltd.</p>
                  <p>Health Plaza, Nairobi</p>
                  <p>Email: support@pharmalink.com</p>
                </div>
              </header>

              {/* Invoice Details */}
              <section className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Invoice No:</span>{" "}
                    {selectedInvoice.invoice_number}
                  </p>
                  <p>
                    <span className="font-semibold">Customer:</span>{" "}
                    {selectedInvoice.customer_name}
                  </p>
                  <p className="font-bold ">
                    <span className="font-bold">Served By:</span>{" "}
                    {selectedInvoice.posted_by || "N/A"}
                  </p>
                </div>
                <div className="space-y-2 text-right">
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {selectedInvoice.date}
                  </p>
                </div>
              </section>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#B57C36] text-white">
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Qty</th>
                      <th className="p-3 text-left">Unit</th>
                      <th className="p-3 text-left">Price (KSH)</th>
                      <th className="p-3 text-left">Discount (%)</th>
                      <th className="p-3 text-left">VAT (%)</th>
                      <th className="p-3 text-left">Line Total (KSH)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items?.map((item, idx) => {
                      const subtotal =
                        Number(item.quantity || 0) * Number(item.price || 0);
                      const discountAmount =
                        subtotal * (Number(item.discount || 0) / 100);
                      const vatAmount =
                        (subtotal - discountAmount) *
                        (Number(item.vat || 0) / 100);
                      const lineTotal = subtotal - discountAmount + vatAmount;

                      return (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3">{item.product_name}</td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3">{item.unit}</td>
                          <td className="p-3">
                            KSH {Number(item.price || 0).toFixed(2)}
                          </td>
                          <td className="p-3">
                            {Number(item.discount || 0).toFixed(2)}%
                          </td>
                          <td className="p-3">
                            {Number(item.vat || 0).toFixed(2)}%
                          </td>
                          <td className="p-3 font-semibold text-[#B57C36]">
                            KSH {lineTotal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-100 font-semibold">
                      <td colSpan={6} className="p-3 text-right">
                        Grand Total
                      </td>
                      <td className="p-3 font-bold text-[#B57C36]">
                        KSH{" "}
                        {Number(selectedInvoice.total_amount || 0).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signature Section */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-[#B57C36] mb-2">
                  Client Confirmation
                </h3>
                <p>
                  <strong>Name:</strong> ____________________________
                </p>
                <p>
                  <strong>Signature:</strong> ________________________
                </p>
                <p>
                  <strong>Date Received:</strong> ____________________
                </p>
              </div>

              {/* Footer */}
              <footer className="border-t pt-4 text-center text-xs text-gray-500 mt-8">
                <p>
                  Thank you for choosing Pharmalink. Please keep this invoice
                  for your records.
                </p>
              </footer>
            </div>

            {/* Modal Action Buttons (fixed at bottom) */}
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                className="bg-[#B57C36] text-white px-5 py-2 rounded-lg shadow hover:bg-[#9E6B2F] transition"
                onClick={handlePrint}
              >
                Print
              </button>
              <button
                className="bg-gray-500 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-700 transition"
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
};

export default Invoices;
