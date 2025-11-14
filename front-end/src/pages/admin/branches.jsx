import React, { useEffect, useState } from "react";
import {getBranches, createBranch, updateBranch, deleteBranch,} from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ name: "", location: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await getBranches();
      setBranches(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateBranch(editingId, formData);
        toast.success("Branch updated");
      } else {
        await createBranch(formData);
        toast.success("Branch created");
      }
      setFormData({ name: "", location: "" });
      setEditingId(null);
      fetchBranches();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to save branch");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (branch) => {
    setFormData({ name: branch.name, location: branch.location });
    setEditingId(branch.id);
  };

  const confirmDelete = (branch) => {
    setBranchToDelete(branch);
    setShowModal(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteBranch(branchToDelete.id);
      toast.success("Branch deleted");
      fetchBranches();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete branch");
    } finally {
      setShowModal(false);
      setBranchToDelete(null);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-white via-white/80 to-white/60 p-6">
      <div className="w-full max-w-5xl bg-white/90 rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#B57C36] mb-8 text-center">
          Manage Branches
        </h1>

        {/* Form Section */}
        <div className="bg-white/70 rounded-lg shadow-md p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className="w-full p-3 rounded-lg border border-[#B57C36]/40 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#B57C36]"
              placeholder="Branch Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              className="w-full p-3 rounded-lg border border-[#B57C36]/40 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#B57C36]"
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-6 w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-3 rounded-lg transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
              ? "Update Branch"
              : "Add Branch"}
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-[#B57C36]/40 rounded-xl shadow-md">
            <thead>
              <tr className="bg-[#B57C36]/10 text-[#B57C36]">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-[#B57C36]/20 hover:bg-white/50 transition"
                >
                  <td className="p-4">{b.name}</td>
                  <td className="p-4">{b.location}</td>
                  <td className="p-4 space-x-4">
                    <button
                      onClick={() => handleEdit(b)}
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(b)}
                      className="text-red-500 hover:text-red-700 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-xl rounded-xl p-6 w-80 text-black">
              <p className="mb-4 text-center">
                Are you sure you want to delete{" "}
                <strong>{branchToDelete?.name}</strong>?
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded bg-white/60 hover:bg-white/80 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default Branches;
