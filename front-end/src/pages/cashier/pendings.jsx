// import React, { useEffect, useState } from "react";
// import { getPayments, confirmPayment } from "../../utils/api";

// const PendingPayments = ({ currentUser }) => {
//   const [payments, setPayments] = useState([]);
//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [formData, setFormData] = useState({
//     amount_paid: "",
//     payment_mode: "cash",
//     mpesa_receipt: "",
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     getPayments("pending").then((res) => setPayments(res.data));
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleConfirm = async () => {
//   setLoading(true);
//   setTimeout(async () => {
//     // Auto-generate receipt if mode is cash
//     let receiptValue = formData.mpesa_receipt;
//     if (formData.payment_mode === "cash" && !receiptValue) {
//       const timestamp = Date.now();
//       receiptValue = `CASH-${timestamp}`;
//     }

//     const payload = {
//       payment_mode: formData.payment_mode,
//       status: "paid",
//       amount_paid: formData.amount_paid || selectedPayment.sale?.total_amount,
//       mpesa_receipt: receiptValue,
//       confirmed_by: currentUser,
//     };

//     await confirmPayment(selectedPayment.sale?.id, payload);
//     setLoading(false);
//     setSelectedPayment(null);
//     getPayments("pending").then((res) => setPayments(res.data));
//   }, 4000);
// }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-[#B57C36] mb-4">Pending Payments</h1>
//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-[#B57C36]/20">
//             <th className="border p-2">Invoice</th>
//             <th className="border p-2">Customer</th>
//             <th className="border p-2">Amount</th>
//             <th className="border p-2">Posted By</th>
//             <th className="border p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {payments.length === 0 ? (
//             <tr>
//               <td colSpan="5" className="text-center p-4 text-gray-500">
//                 No pending payments found.
//               </td>
//             </tr>
//           ) : (
//             payments.map((p) => (
//               <tr key={p.id}>
//                 <td className="border p-2">{p.sale?.invoice_number}</td>
//                 <td className="border p-2">{p.sale?.customer_name}</td>
//                 <td className="border p-2">{p.sale?.total_amount}</td>
//                 <td className="border p-2">{p.sale?.confirmed_by || "N/A"}</td>
//                 <td className="border p-2">
//                   <button
//                     onClick={() => {
//                       setSelectedPayment(p);
//                       setFormData({
//                         amount_paid: p.sale?.total_amount,
//                         payment_mode: p.payment_mode || "cash",
//                         mpesa_receipt: "",
//                       });
//                     }}
//                     className="bg-[#B57C36] text-white px-3 py-1 rounded hover:bg-[#a56b2f]"
//                   >
//                     View
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* Glassmorphic Modal */}
//       {selectedPayment && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-200/40 backdrop-blur-sm">
//           <div className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-2xl w-96 border border-white/30">
//             <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Payment</h2>
//             <p className="text-gray-700"><strong>Invoice:</strong> {selectedPayment.sale?.invoice_number}</p>
//             <p className="text-gray-700"><strong>Customer:</strong> {selectedPayment.sale?.customer_name}</p>
//             <p className="text-gray-700"><strong>Total:</strong> {selectedPayment.sale?.total_amount}</p>

//             <div className="mt-4">
//               <label className="block mb-2 text-gray-700">Amount Paid</label>
//               <input
//                 type="number"
//                 name="amount_paid"
//                 value={formData.amount_paid}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded bg-white/60 backdrop-blur-sm text-gray-800"
//               />
//             </div>

//             <div className="mt-4">
//               <label className="block mb-2 text-gray-700">Payment Mode</label>
//               <select
//                 name="payment_mode"
//                 value={formData.payment_mode}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded bg-white/60 backdrop-blur-sm text-gray-800"
//               >
//                 <option value="cash">Cash</option>
//                 <option value="mpesa">M-Pesa</option>
//                 <option value="card">Card</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>

//             <div className="mt-4">
//               <label className="block mb-2 text-gray-700">M-Pesa Receipt</label>
//               <input
//                 type="text"
//                 name="mpesa_receipt"
//                 value={formData.mpesa_receipt}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded bg-white/60 backdrop-blur-sm text-gray-800"
//               />
//             </div>

//             <div className="mt-6 flex justify-end space-x-2">
//               <button
//                 onClick={() => setSelectedPayment(null)}
//                 className="px-4 py-2 border rounded bg-white/50 text-gray-700 hover:bg-white/70"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirm}
//                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                 disabled={loading}
//               >
//                 {loading ? "Processing..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PendingPayments;

import React, { useEffect, useState } from "react";
import { getPayments, confirmPayment, initiateStkPush } from "../../utils/api";
import { FiDollarSign, FiUser, FiFileText, FiCheck, FiX, FiSmartphone } from "react-icons/fi";

const PendingPayments = ({ currentUser }) => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    amount_paid: "",
    payment_mode: "cash",
    mpesa_receipt: "",
  });
  const [loading, setLoading] = useState(false);
  const [stkModal, setStkModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [stkResponse, setStkResponse] = useState(null);

  useEffect(() => {
    getPayments("pending").then((res) => setPayments(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // If user selects mpesa, open STK modal
    if (e.target.name === "payment_mode" && e.target.value === "mpesa") {
      setStkModal(true);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    setTimeout(async () => {
      let receiptValue = formData.mpesa_receipt;
      if (formData.payment_mode === "cash" && !receiptValue) {
  const now = new Date();

  // Get last two digits of year
  const year = now.getFullYear().toString().slice(-2);

  // Month (pad with leading zero if needed)
  const month = String(now.getMonth() + 1).padStart(2, "0");

  // Day (pad with leading zero if needed)
  const day = String(now.getDate()).padStart(2, "0");

  // Build receipt value
  receiptValue = `CASH-${year}${month}${day}`;
}

      const payload = {
        payment_mode: formData.payment_mode,
        status: "paid",
        amount_paid: formData.amount_paid || selectedPayment.sale?.total_amount,
        mpesa_receipt: receiptValue,
        confirmed_by: currentUser,
      };

      await confirmPayment(selectedPayment.sale?.id, payload);
      setLoading(false);
      setSelectedPayment(null);
      getPayments("pending").then((res) => setPayments(res.data));
    }, 3000);
  };

  const handleStkPush = async () => {
    if (!phoneNumber) {
      alert("Please enter phone number");
      return;
    }
    setLoading(true);
    try {
      const res = await initiateStkPush({
        phoneNumber,
        amount: formData.amount_paid || selectedPayment.sale?.total_amount,
      });
      setStkResponse(res);
    } catch (err) {
      setStkResponse({ error: "Failed to initiate STK Push" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        {/* <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#B57C36] mb-2">
                Pending Payments
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Review and confirm outstanding customer payments
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg border border-[#B57C36]/20">
              <p className="text-sm text-gray-600">Total Pending</p>
              <p className="text-2xl font-bold text-[#B57C36]">{payments.length}</p>
            </div>
          </div>
        </div> */}

        {/* Payments Table Card */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-[#B57C36]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#B57C36] text-white">
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <FiFileText />
                      Invoice
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <FiUser />
                      Customer
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <FiDollarSign />
                      Amount
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Posted By</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-12">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <FiFileText className="text-4xl" />
                        </div>
                        <p className="text-lg font-medium">No pending payments</p>
                        <p className="text-sm mt-2">All payments have been processed</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments.map((p, index) => (
                    <tr 
                      key={p.id} 
                      className={`border-b border-gray-200 hover:bg-[#B57C36]/5 transition-colors ${
                        index % 2 === 0 ? 'bg-white/40' : 'bg-white/20'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <span className="font-semibold text-gray-800">
                          {p.sale?.invoice_number}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {p.sale?.customer_name}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-bold text-[#B57C36] text-lg">
                          KES {parseFloat(p.sale?.total_amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {p.sale?.confirmed_by || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedPayment(p);
                            setFormData({
                              amount_paid: p.sale?.total_amount,
                              payment_mode: p.payment_mode || "cash",
                              mpesa_receipt: "",
                            });
                          }}
                          className="bg-gradient-to-r from-[#B57C36] to-[#a56b2f] text-white px-6 py-2 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-[#B57C36]/30 animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#B57C36] to-[#a56b2f] text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-center">Confirm Payment</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Payment Details Card */}
              <div className="bg-[#B57C36]/5 rounded-xl p-4 space-y-3 border border-[#B57C36]/20">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Invoice Number</span>
                  <span className="font-bold text-gray-800">{selectedPayment.sale?.invoice_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Customer</span>
                  <span className="font-semibold text-gray-800">{selectedPayment.sale?.customer_name}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#B57C36]/20">
                  <span className="text-gray-600 text-sm">Total Amount</span>
                  <span className="font-bold text-[#B57C36] text-xl">
                    KES {parseFloat(selectedPayment.sale?.total_amount).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Amount Paid Input */}
              <div>
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Amount Paid 
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <p>KES</p>
                  </div>
                  <input
                    type="number"
                    name="amount_paid"
                    value={formData.amount_paid}
                    onChange={handleChange}
                    className="border border-gray-300 pl-10 pr-4 py-3 w-full rounded-xl focus:ring-2 focus:ring-[#B57C36] focus:border-transparent transition outline-none"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* Payment Mode Select */}
              <div>
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Payment Mode
                </label>
                <select
                  name="payment_mode"
                  value={formData.payment_mode}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#B57C36] focus:border-transparent transition outline-none bg-white"
                >
                  <option value="cash">Cash</option>
                  <option value="mpesa"> M-Pesa</option>
                  <option value="card">Card</option>
                  <option value="other"> Other</option>
                </select>
              </div>

              {/* Receipt Input (not for M-Pesa) */}
              {formData.payment_mode !== "mpesa" && (
                <div>
                  <label className="block mb-2 text-gray-700 font-semibold text-sm">
                    Receipt Number
                  </label>
                  <input
                    type="text"
                    name="mpesa_receipt"
                    value={formData.mpesa_receipt}
                    onChange={handleChange}
                    className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#B57C36] focus:border-transparent transition outline-none"
                    placeholder="Optional - auto-generated if empty"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generated receipt</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  <FiX className="inline mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin inline h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCheck className="inline mr-2" />
                      Confirm Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STK Push Modal */}
      {stkModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-green-500/30 animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FiSmartphone className="text-2xl" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center">M-Pesa STK Push</h2>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-gray-600 text-center">
                Enter customer phone number to initiate payment request
              </p>

              {/* Amount Display */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-gray-600 text-center">Amount to be paid</p>
                <p className="text-2xl font-bold text-green-700 text-center">
                  KES {parseFloat(formData.amount_paid || selectedPayment?.sale?.total_amount).toLocaleString()}
                </p>
              </div>

              {/* Phone Number Input */}
              <div>
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSmartphone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="border border-gray-300 pl-10 pr-4 py-3 w-full rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: 254XXXXXXXXX</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStkModal(false);
                    setStkResponse(null);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStkPush}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin inline h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send STK Push"
                  )}
                </button>
              </div>

              {/* STK Response */}
              {stkResponse && (
                <div className={`rounded-xl p-4 border ${
                  stkResponse.error 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <h3 className={`text-sm font-semibold mb-2 ${
                    stkResponse.error ? 'text-red-700' : 'text-green-700'
                  }`}>
                    Response
                  </h3>
                  <div className="bg-white rounded-lg p-3 overflow-x-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                      {JSON.stringify(stkResponse, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingPayments;