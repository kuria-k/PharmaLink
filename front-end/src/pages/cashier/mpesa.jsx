import React, { useState } from "react";
import { initiateStkPush } from "../../utils/api";
import { FiSmartphone, FiDollarSign, FiSend, FiCheckCircle, FiXCircle } from "react-icons/fi";

const MpesaTransactions = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleStkPush = async () => {
    // Validation
    if (!phoneNumber || !amount) {
      setError("Please enter both Phone Number and Amount");
      return;
    }

    if (phoneNumber.length < 12) {
      setError("Please enter a valid phone number (e.g., 254712345678)");
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await initiateStkPush({ phoneNumber, amount });
      setResponse(res);
      
      // Clear form on success
      if (res && !res.error) {
        setPhoneNumber("");
        setAmount("");
      }
    } catch (err) {
      setError(err.message || "Failed to initiate STK Push");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleStkPush();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-600 rounded-full mb-4 shadow-lg">
            <FiSmartphone className="text-white text-2xl sm:text-3xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            M-Pesa STK Push
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Initiate secure M-Pesa payments directly from your dashboard
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Payment Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiSend className="text-green-600" />
              Payment Details
            </h2>

            <div className="space-y-5 sm:space-y-6">
              {/* Phone Number Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSmartphone className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="tel"
                    placeholder="254712345678"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setError(null);
                    }}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition outline-none text-sm sm:text-base"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: +254XXXXXXXXX</p>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (KES) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <FiDollarSign className="text-gray-400 text-lg" /> */}
                  </div>
                  <input
                    type="number"
                    placeholder="500"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError(null);
                    }}
                    onKeyPress={handleKeyPress}
                    min="1"
                    className="w-full pl-10 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition outline-none text-sm sm:text-base"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum amount: KES 1</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <FiXCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleStkPush}
                disabled={loading}
                className={`w-full py-3 sm:py-4 px-6 rounded-xl text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Send STK Push
                  </>
                )}
              </button>
            </div>

            {/* Info Section */}
            <div className="mt-6 sm:mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h3>
              <ol className="text-xs sm:text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Enter the customer's M-Pesa registered phone number</li>
                <li>Specify the amount to be paid</li>
                <li>Click "Send STK Push" to initiate payment</li>
                <li>Customer will receive a prompt on their phone to complete payment</li>
              </ol>
            </div>
          </div>

          {/* Response Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
              Transaction Response
            </h2>

            {!response && !loading && (
              <div className="h-64 sm:h-96 flex flex-col items-center justify-center text-gray-400">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiSmartphone className="text-4xl sm:text-5xl" />
                </div>
                <p className="text-sm sm:text-base text-center">No transaction yet</p>
                <p className="text-xs sm:text-sm text-center mt-2">Response will appear here after initiating payment</p>
              </div>
            )}

            {loading && (
              <div className="h-64 sm:h-96 flex flex-col items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                <p className="text-sm sm:text-base text-gray-600">Processing transaction...</p>
              </div>
            )}

            {response && (
              <div className="space-y-4">
                {/* Success/Error Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  response.error 
                    ? "bg-red-100 text-red-700" 
                    : "bg-green-100 text-green-700"
                }`}>
                  {response.error ? (
                    <>
                      <FiXCircle />
                      Transaction Failed
                    </>
                  ) : (
                    <>
                      <FiCheckCircle />
                      Transaction Initiated
                    </>
                  )}
                </div>

                {/* Response Details */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 overflow-hidden">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Details:</h3>
                  <div className="overflow-x-auto">
                    <pre className="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap break-words">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Clear Button */}
                <button
                  onClick={() => setResponse(null)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition text-sm sm:text-base"
                >
                  Clear Response
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Important Notes</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Instant Processing</h4>
                <p className="text-xs text-gray-600 mt-1">STK push is sent immediately to the customer</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiSmartphone className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Customer Confirmation</h4>
                <p className="text-xs text-gray-600 mt-1">Customer must enter M-Pesa PIN to complete</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiDollarSign className="text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Secure Transactions</h4>
                <p className="text-xs text-gray-600 mt-1">All payments are processed securely via M-Pesa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MpesaTransactions;


