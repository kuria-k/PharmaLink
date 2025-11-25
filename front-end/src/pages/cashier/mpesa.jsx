import React, { useState } from "react";
import { initiateStkPush } from "../../utils/api";

const MpesaTransactions = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleStkPush = async () => {
    if (!phoneNumber || !amount) {
      alert("Please enter both Phone Number and Amount");
      return;
    }

    setLoading(true);
    try {
      const res = await initiateStkPush({ phoneNumber, amount });
      setResponse(res);
    } catch (err) {
      setResponse({ error: "Failed to initiate STK Push" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          Manual M-Pesa STK Push
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Enter <span className="font-semibold">Phone Number</span> and{" "}
          <span className="font-semibold">Amount</span> to initiate payment.
        </p>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="2547XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (KES)
            </label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleStkPush}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Processing..." : "Send STK Push"}
          </button>
        </div>

        {/* Response */}
        {response && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Response</h2>
            <pre className="text-sm text-gray-600 overflow-x-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MpesaTransactions;


