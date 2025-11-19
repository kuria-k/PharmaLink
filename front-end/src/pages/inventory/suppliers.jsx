import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

// Static list of countries
const countries = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Bahamas","Bahrain","Bangladesh",
  "Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cambodia","Cameroon","Canada","Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica",
  "Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia",
  "Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Greenland","Grenada","Guatemala",
  "Guinea","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan",
  "Jordan","Kazakhstan","Kenya","Kuwait","Latvia","Lebanon","Lesotho","Liberia","Libya","Lithuania","Luxembourg","Madagascar","Malawi",
  "Malaysia","Maldives","Mali","Malta","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Panama",
  "Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal",
  "Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan",
  "Suriname","Sweden","Switzerland","Syria","Taiwan","Tanzania","Thailand","Togo","Trinidad and Tobago","Tunisia","Turkey","Uganda","Ukraine",
  "United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

const API_BASE = "http://localhost:8000/api/inventory";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Create form state
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    country: "",
  });

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    country: "",
  });

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingSupplier, setDeletingSupplier] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all"); // all | name | contact_person | phone | email | country

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/suppliers/`);
        setSuppliers(res.data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
        setMessage("Failed to fetch suppliers.");
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  // Utility: case-insensitive includes
  const ciIncludes = (haystack, needle) =>
    (haystack || "").toString().toLowerCase().includes((needle || "").toString().toLowerCase());

  // Client-side filtering (fast, responsive)
  const filteredSuppliers = useMemo(() => {
    if (!searchTerm.trim()) return suppliers;
    return suppliers.filter((s) => {
      const term = searchTerm.trim().toLowerCase();
      if (searchField === "all") {
        return (
          ciIncludes(s.name, term) ||
          ciIncludes(s.contact_person, term) ||
          ciIncludes(s.phone, term) ||
          ciIncludes(s.email, term) ||
          ciIncludes(s.country, term) ||
          ciIncludes(s.address, term)
        );
      }
      return ciIncludes(s[searchField], term);
    });
  }, [suppliers, searchTerm, searchField]);

  // Create form handlers
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const resetCreateForm = () => {
    setNewSupplier({
      name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
      country: "",
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      // Simple validation
      if (!newSupplier.name.trim()) {
        setMessage("Supplier name is required.");
        setSaving(false);
        return;
      }
      const res = await axios.post(`${API_BASE}/suppliers/`, newSupplier);
      setSuppliers((prev) => [...prev, res.data]);
      resetCreateForm();
      setMessage("Supplier added successfully.");
    } catch (err) {
      console.error("Error adding supplier:", err);
      setMessage(
        err.response?.data
          ? `Failed to add supplier: ${JSON.stringify(err.response.data)}`
          : "Failed to add supplier. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit modal open
  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setEditForm({
      name: supplier.name || "",
      contact_person: supplier.contact_person || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
      country: supplier.country || "",
    });
    setIsEditOpen(true);
  };

  // Edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save edit
  const handleEditSave = async () => {
    if (!editingSupplier) return;
    setSaving(true);
    setMessage("");
    try {
      // PATCH update
      const res = await axios.patch(
        `${API_BASE}/suppliers/${editingSupplier.id}/`,
        editForm
      );
      // Update local list
      setSuppliers((prev) =>
        prev.map((s) => (s.id === editingSupplier.id ? res.data : s))
      );
      setIsEditOpen(false);
      setEditingSupplier(null);
      setMessage("Supplier updated successfully.");
    } catch (err) {
      console.error("Error updating supplier:", err);
      setMessage(
        err.response?.data
          ? `Failed to update supplier: ${JSON.stringify(err.response.data)}`
          : "Failed to update supplier. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete modal open
  const openDeleteModal = (supplier) => {
    setDeletingSupplier(supplier);
    setIsDeleteOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deletingSupplier) return;
    setSaving(true);
    setMessage("");
    try {
      await axios.delete(`${API_BASE}/suppliers/${deletingSupplier.id}/`);
      setSuppliers((prev) => prev.filter((s) => s.id !== deletingSupplier.id));
      setIsDeleteOpen(false);
      setDeletingSupplier(null);
      setMessage("Supplier deleted successfully.");
    } catch (err) {
      console.error("Error deleting supplier:", err);
      setMessage("Failed to delete supplier. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Close modals
  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingSupplier(null);
  };
  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeletingSupplier(null);
  };

  // UI helpers
  const Label = ({ children }) => (
    <label className="text-sm font-semibold text-[#B57C36]">{children}</label>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass p-6">
        <h1 className="text-3xl font-bold text-[#B57C36]">Suppliers</h1>
        <p className="mt-2 text-gray-700">
          Manage supplier information, edit or delete suppliers, and search easily.
        </p>
        {message && (
          <div className="mt-3 px-4 py-2 rounded-lg bg-[#B57C36]/10 text-[#B57C36]">
            {message}
          </div>
        )}
      </div>

      {/* Add Supplier Form */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Add New Supplier</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreateSubmit}>
          <div className="flex flex-col gap-1">
            <Label>Name</Label>
            <input
              type="text"
              name="name"
              placeholder="Supplier Name"
              value={newSupplier.name}
              onChange={handleCreateChange}
              className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Contact person</Label>
            <input
              type="text"
              name="contact_person"
              placeholder="Contact Person"
              value={newSupplier.contact_person}
              onChange={handleCreateChange}
              className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Phone</Label>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={newSupplier.phone}
              onChange={handleCreateChange}
              className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Email</Label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={newSupplier.email}
              onChange={handleCreateChange}
              className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label>Address</Label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newSupplier.address}
              onChange={handleCreateChange}
              className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label>Country</Label>
            <select
              name="country"
              value={newSupplier.country}
              onChange={handleCreateChange}
              className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              {saving && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {saving ? "Saving..." : "Save Supplier"}
            </button>
            <button
              type="button"
              onClick={resetCreateForm}
              className="px-4 py-2 rounded-lg border border-[#B57C36]/40 text-[#B57C36] hover:bg-[#B57C36]/10"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Search Bar */}
      <div className="glass p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-3 w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
          />
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="md:col-span-1 w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
          >
            <option value="all">All fields</option>
            <option value="name">Name</option>
            <option value="contact_person">Contact person</option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="country">Country</option>
          </select>
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="md:col-span-1 w-full bg-white text-[#B57C36] border border-[#B57C36]/40 px-4 py-2 rounded-lg hover:bg-[#B57C36]/10"
          >
            Clear search
          </button>
        </div>
        {loading ? (
          <div className="mt-3 text-[#B57C36]">Loading suppliers...</div>
        ) : (
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredSuppliers.length} of {suppliers.length}
          </div>
        )}
      </div>

      {/* Suppliers Table */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Suppliers List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#B57C36]/20 text-[#B57C36]">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Contact Person</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.contact_person}</td>
                  <td className="p-3">{s.phone}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.address}</td>
                  <td className="p-3">{s.country}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="px-3 py-1 rounded-md bg-[#B57C36] text-white hover:bg-[#9E6B2F]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(s)}
                        className="px-3 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSuppliers.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    No suppliers match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal (Glassmorphic) */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closeEditModal}
          />
          {/* Modal */}
          <div className="relative glass p-6 w-full max-w-2xl mx-4">
            <h3 className="text-2xl font-semibold text-[#B57C36] mb-4">
              Edit Supplier
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label>Name</Label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Contact person</Label>
                <input
                  type="text"
                  name="contact_person"
                  value={editForm.contact_person}
                  onChange={handleEditChange}
                  className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Phone</Label>
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Email</Label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <Label>Address</Label>
                <input
                  type="text"
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <Label>Country</Label>
                <select
                  name="country"
                  value={editForm.country}
                  onChange={handleEditChange}
                  className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 rounded-lg border border-[#B57C36]/40 text-[#B57C36] hover:bg-[#B57C36]/10"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                {saving && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal (Glassmorphic) */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />
          {/* Modal */}
          <div className="relative glass p-6 w-full max-w-md mx-4">
            <h3 className="text-2xl font-semibold text-[#B57C36] mb-4">
              Delete Supplier
            </h3>
            <p className="text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#B57C36]">
                {deletingSupplier?.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded-lg border border-[#B57C36]/40 text-[#B57C36] hover:bg-[#B57C36]/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                {saving && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;


