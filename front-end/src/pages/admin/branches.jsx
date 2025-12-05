import React, { useEffect, useState } from "react";
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ name: "", location: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [branchToDelete, setBranchToDelete] = useState(null);

  // Fetch branches on load
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await getBranches();
      setBranches(res.data);
    } catch (err) {
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingId) {
        await updateBranch(editingId, formData);
        toast.success("Branch updated successfully");
      } else {
        await createBranch(formData);
        toast.success("Branch created successfully");
      }
      setFormData({ name: "", location: "" });
      setEditingId(null);
      fetchBranches();
      setShowEditModal(false);
    } catch {
      toast.error("Error saving branch");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (branch) => {
    setFormData({ name: branch.name, location: branch.location });
    setEditingId(branch.id);
    setShowEditModal(true);
  };

  const confirmDelete = (branch) => {
    setBranchToDelete(branch);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteBranch(branchToDelete.id);
      toast.success("Branch deleted");
      fetchBranches();
    } catch {
      toast.error("Failed to delete branch");
    } finally {
      setShowDeleteModal(false);
      setBranchToDelete(null);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-[#fff6ee] to-[#f8efe7] p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-6 sm:p-10">

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#B57C36] mb-8 text-center">
          Manage Branches
        </h1>

        {/* Create Branch Form */}
        <div className="bg-white border border-[#B57C36]/20 rounded-xl shadow-md p-6 sm:p-8">

          <h2 className="text-xl font-semibold text-[#B57C36] mb-4">
            {editingId ? "Update Branch" : "Create Branch"}
          </h2>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input
              className="p-3 rounded-lg border border-[#B57C36]/30 shadow-sm focus:ring-2 focus:ring-[#B57C36] outline-none"
              placeholder="Branch Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              className="p-3 rounded-lg border border-[#B57C36]/30 shadow-sm focus:ring-2 focus:ring-[#B57C36] outline-none"
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
            className={`mt-6 w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
              ? "Save Changes"
              : "Add Branch"}
          </button>
        </div>

        {/* TABLE */}
        <div className="mt-10 overflow-hidden rounded-xl shadow-md border border-[#B57C36]/20">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="bg-[#B57C36]/15 text-[#B57C36] uppercase text-sm sticky top-0">
                  <th className="p-4">Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((b) => (
                  <tr
                    key={b.id}
                    className="border-t border-[#B57C36]/10 hover:bg-[#fff7ef] transition"
                  >
                    <td className="p-4 font-medium">{b.name}</td>
                    <td className="p-4">{b.location}</td>
                    <td className="p-4 flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(b)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(b)}
                        className="text-red-600 hover:text-red-800 hover:underline font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {branches.length === 0 && (
            <p className="text-center p-6 text-gray-500">No branches found.</p>
          )}
        </div>

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Confirm Delete
              </h2>
              <p className="mb-6">
                Are you sure you want to delete{" "}
                <strong>{branchToDelete?.name}</strong>?
              </p>

              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-1/2 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="w-1/2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

              <h2 className="text-xl font-semibold text-[#B57C36] mb-4 text-center">
                Edit Branch
              </h2>

              <input
                className="w-full p-3 mb-4 rounded-lg border border-[#B57C36]/30 shadow-sm"
                placeholder="Branch Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                className="w-full p-3 mb-4 rounded-lg border border-[#B57C36]/30 shadow-sm"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />

              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-1/2 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="w-1/2 py-2 bg-[#B57C36] text-white rounded-lg hover:bg-[#9E6B2F] transition"
                >
                  {loading ? "Saving..." : "Save"}
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


