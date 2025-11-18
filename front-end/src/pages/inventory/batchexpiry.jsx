import React, { useState, useEffect } from "react";
import { getBatches } from "../../utils/api"; 
import axios from "axios";

const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 30;

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await getBatches();
        setBatches(res.data); 
      } catch (err) {
        console.error("Error fetching batches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const handleCreateFromCompleted = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/inventory/batches/from-completed/"
      );
      setBatches([...batches, res.data.batch]); 
    } catch (err) {
      console.error("Error creating batch from completed POs:", err);
      alert("No completed purchase orders found or request failed.");
    }
  };

  if (loading) {
    return <div className="p-6">Loading batch data...</div>;
  }

  const paginated = batches.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass p-6">
        <h1 className="text-3xl font-bold text-[#B57C36]">Batch Management</h1>
        <p className="mt-2 text-gray-700">
          Automatically generate batches from completed purchase orders.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Total Batches</h2>
          <p className="text-2xl font-bold">{batches.length}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Total Quantity</h2>
          <p className="text-2xl font-bold">
            {batches.reduce((sum, b) => sum + Number(b.quantity || 0), 0)}
          </p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Suppliers</h2>
          <p className="text-2xl font-bold">
            {[...new Set(batches.map((b) => b.supplier))].length}
          </p>
        </div>
      </div>

      {/* Create Batch from Completed POs */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">
          Create Batch from Completed Purchase Orders
        </h2>
        <button
          onClick={handleCreateFromCompleted}
          className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-4 py-2 rounded-lg"
        >
          Generate Batch
        </button>
      </div>

      {/* Batch Table */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Batch Records</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#B57C36]/20 text-[#B57C36]">
              <th className="p-3 text-left">Batch No</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">Date Received</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((b, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-3">{b.batch_no}</td>
                <td className="p-3">{b.sku}</td>
                <td className="p-3">{b.product}</td>
                <td className="p-3">{b.quantity}</td>
                <td className="p-3">{b.supplier}</td>
                <td className="p-3">{b.received}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-[#B57C36] text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-[#B57C36] font-semibold">
            Page {page} of {Math.ceil(batches.length / pageSize)}
          </span>

          <button
            disabled={page * pageSize >= batches.length}
            onClick={() => setPage(page + 1)}
            className="bg-[#B57C36] text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchManagement;

