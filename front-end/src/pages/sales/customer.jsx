// src/pages/sales/Customers.jsx
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../utils/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load customers from backend
  useEffect(() => {
    getCustomers()
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) return;

    try {
      if (isEditing) {
        await updateCustomer(form.id, form);
        setCustomers((prev) =>
          prev.map((c) => (c.id === form.id ? { ...c, ...form } : c))
        );
        toast.success("Customer updated successfully!");
      } else {
        const res = await createCustomer(form);
        setCustomers((prev) => [...prev, res.data]);
        toast.success("Customer added successfully!");
      }
    } catch (err) {
      toast.error("Error saving customer");
    }

    setForm({ id: null, name: "", phone: "", email: "", address: "" });
    setIsEditing(false);
    setShowEditModal(false);
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCustomer(deleteId);
      setCustomers((prev) => prev.filter((c) => c.id !== deleteId));
      toast.success("Customer deleted successfully!");
    } catch (err) {
      toast.error("Error deleting customer");
    }
    setShowDeleteModal(false);
  };
return (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-8">
    <Toaster position="top-right" />
    <h2 className="text-3xl font-extrabold text-[#B57C36] mb-6 border-b pb-3 tracking-wide">
      Customers
    </h2>

    {/* Add Customer Button */}
    <button
      onClick={() => {
        setForm({ id: null, name: "", phone: "", email: "", address: "" });
        setIsEditing(false);
        setShowEditModal(true);
      }}
      className="mb-6 bg-gradient-to-r from-[#B57C36] to-[#9E6B2F] text-white px-6 py-3 rounded-lg shadow-md hover:scale-105 transform transition"
    >
      + Add Customer
    </button>

    {/* Table */}
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#B57C36]/20 text-[#B57C36] text-sm uppercase tracking-wider">
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Phone</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Address</th>
            <th className="p-4 text-left">Total Sales</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, idx) => (
            <tr
              key={c.id}
              className={`border-b transition ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-[#B57C36]/10`}
            >
              <td className="p-4">{c.name}</td>
              <td className="p-4">{c.phone}</td>
              <td className="p-4">{c.email}</td>
              <td className="p-4">{c.address || "—"}</td>
              <td className="p-4 font-semibold text-[#B57C36]">
                {c.totalSales}
              </td>
              <td className="p-4 flex gap-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(c.id)}
                  className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="text-center p-6 text-gray-500 italic"
              >
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Add/Edit Modal */}
    <Dialog
      open={showEditModal}
      onClose={() => setShowEditModal(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold text-[#B57C36] mb-6">
            {isEditing ? "Edit Customer" : "Add Customer"}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["name", "phone", "email", "address"].map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-[#B57C36]/40 bg-gray-50 focus:ring-2 focus:ring-[#B57C36] outline-none"
              />
            ))}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#B57C36] to-[#9E6B2F] text-white hover:scale-105 transform transition"
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>

    {/* Delete Confirmation Modal */}
    <Dialog
      open={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
          <Dialog.Title className="text-xl font-bold text-white mb-4">
            Confirm Delete
          </Dialog.Title>
          <p className="text-sm text-gray-100 mb-6">
            Are you sure you want to delete this customer? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-5 py-2 rounded-lg border border-gray-400 text-gray-200 hover:bg-gray-200/20 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow hover:scale-105 transform transition"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  </div>
);
}

export default Customers;
