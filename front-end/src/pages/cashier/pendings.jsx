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
        const timestamp = Date.now();
        receiptValue = `CASH-${timestamp}`;
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
  <div className="p-6">
    {/* Page Title */}
    <h1 className="text-3xl font-bold text-[#B57C36] mb-6 text-center">
      Pending Payments
    </h1>

    {/* Payments Table */}
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-[#B57C36]/20 text-gray-800">
            <th className="border p-3">Invoice</th>
            <th className="border p-3">Customer</th>
            <th className="border p-3">Amount</th>
            <th className="border p-3">Posted By</th>
            <th className="border p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-6 text-gray-500">
                No pending payments found.
              </td>
            </tr>
          ) : (
            payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="border p-3">{p.sale?.invoice_number}</td>
                <td className="border p-3">{p.sale?.customer_name}</td>
                <td className="border p-3">{p.sale?.total_amount}</td>
                <td className="border p-3">{p.sale?.confirmed_by || "N/A"}</td>
                <td className="border p-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedPayment(p);
                      setFormData({
                        amount_paid: p.sale?.total_amount,
                        payment_mode: p.payment_mode || "cash",
                        mpesa_receipt: "",
                      });
                    }}
                    className="bg-[#B57C36] text-white px-4 py-2 rounded-lg hover:bg-[#a56b2f] transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* Payment Confirmation Modal */}
    {selectedPayment && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div className="bg-white rounded-xl shadow-2xl w-[420px] p-6 animate-fadeIn">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            Confirm Payment
          </h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Invoice:</strong> {selectedPayment.sale?.invoice_number}</p>
            <p><strong>Customer:</strong> {selectedPayment.sale?.customer_name}</p>
            <p><strong>Total:</strong> {selectedPayment.sale?.total_amount}</p>
          </div>

          <div className="mt-4">
            <label className="block mb-2 text-gray-700">Amount Paid</label>
            <input
              type="number"
              name="amount_paid"
              value={formData.amount_paid}
              onChange={handleChange}
              className="border p-2 w-full rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#B57C36]"
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2 text-gray-700">Payment Mode</label>
            <select
              name="payment_mode"
              value={formData.payment_mode}
              onChange={handleChange}
              className="border p-2 w-full rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#B57C36]"
            >
              <option value="cash">Cash</option>
              <option value="mpesa">M-Pesa</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </select>
          </div>

          {formData.payment_mode !== "mpesa" && (
            <div className="mt-4">
              <label className="block mb-2 text-gray-700">Receipt</label>
              <input
                type="text"
                name="mpesa_receipt"
                value={formData.mpesa_receipt}
                onChange={handleChange}
                className="border p-2 w-full rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#B57C36]"
              />
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setSelectedPayment(null)}
              className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* STK Push Modal */}
    {stkModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="bg-white rounded-xl shadow-2xl w-[400px] p-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
            M-Pesa STK Push
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Enter customer phone number to initiate payment.
          </p>
          <input
            type="tel"
            placeholder="2547XXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border p-3 w-full rounded-lg mb-4 focus:ring-2 focus:ring-green-500"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setStkModal(false)}
              className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleStkPush}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send STK Push"}
            </button>
          </div>

          {stkResponse && (
            <div className="mt-4 bg-gray-50 p-3 rounded-lg border text-sm text-gray-700">
              <pre className="overflow-x-auto">
                {JSON.stringify(stkResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

}

export default PendingPayments;
