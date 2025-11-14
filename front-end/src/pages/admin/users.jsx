import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    branches: [],
  });

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/profiles/");
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err);
      toast.error("Failed to load users");
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await api.get("/branches/");
      setBranches(res.data);
    } catch (err) {
      console.error("Fetch branches error:", err);
      toast.error("Failed to load branches");
    }
  };

  const handleCreateOrUpdate = async () => {
    setLoading(true);

    // Build payload carefully
    const payload = {
      user: {
        username: formData.username.trim(),
        email: formData.email.trim(),
        ...(formData.password ? { password: formData.password } : {}), // ✅ only include if not empty
      },
      role: formData.role,
      branch_ids: formData.branches.map(Number),
    };

    try {
      if (editingUser) {
        // ✅ Use PATCH for partial updates
        await api.patch(`/profiles/${editingUser.id}/`, payload);
        toast.success("User updated successfully");
      } else {
        await api.post("/profiles/", payload);
        toast.success("User created successfully");
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      const err = error.response?.data || {};
      console.error("Save user error:", err);
      toast.error(
        err?.user?.username?.[0] ||
          err?.user?.password?.[0] ||
          err?.role?.[0] ||
          err?.branch_ids?.[0] ||
          "Failed to save user"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "",
      branches: [],
    });
    setEditingUser(null);
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.user.username,
      email: user.user.email || "",
      password: "",
      role: user.role,
      branches: user.branches.map((b) => String(b.id)), // keep IDs as strings for UI
    });
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/profiles/${userToDelete.id}/`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error(
        "Delete user error:",
        error.response?.data || error.message
      );
      toast.error("Failed to delete user");
    } finally {
      setShowModal(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-white via-white/80 to-white/60 p-6">
      <div className="w-full max-w-5xl bg-white/90 rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#B57C36] mb-8 text-center">
          Manage Users
        </h1>

        {/* User Form */}
        <div className="bg-white/70 rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold text-[#B57C36] mb-6 text-center">
            {editingUser ? "Update User" : "Create User"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[#B57C36] mb-2">
                Username
              </label>
              <input
                className="w-full p-3 rounded-lg border border-[#B57C36]/40 bg-white text-black"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#B57C36] mb-2">
                Email
              </label>
              <input
                className="w-full p-3 rounded-lg border border-[#B57C36]/40 bg-white text-black"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#B57C36] mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 rounded-lg border border-[#B57C36]/40 bg-white text-black"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-[#B57C36] mb-2">
                Role
              </label>
              <select
                className="w-full p-3 rounded-lg border border-[#B57C36]/40 bg-white text-black"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="">--Select Role--</option>
                <option value="cashier">Cashier</option>
                <option value="sales">Sales</option>
                <option value="inventory">Inventory</option>
              </select>
            </div>
          </div>

          {/* Branch Selector */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-[#B57C36] mb-2">
              Assign Branches
            </label>
            <div className="max-h-48 overflow-y-auto border border-[#B57C36]/40 rounded-lg bg-white p-3 space-y-2">
              {branches.map((b) => (
                <label
                  key={b.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-[#B57C36]/10 rounded-md p-2 transition"
                >
                  <input
                    type="checkbox"
                    value={b.id}
                    checked={formData.branches.includes(String(b.id))}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        branches: prev.branches.includes(value)
                          ? prev.branches.filter((id) => id !== value)
                          : [...prev.branches, value],
                      }));
                    }}
                    className="accent-[#B57C36]"
                  />
                  <span className="text-black">{b.name}</span>
                </label>
              ))}
            </div>

            {/* Selected Branches as Pills */}
            {formData.branches.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.branches.map((id) => {
                  const branch = branches.find((b) => String(b.id) === id);
                  return (
                    <span
                      key={id}
                      className="px-3 py-1 bg-[#B57C36]/20 text-[#B57C36] rounded-full text-sm font-medium"
                    >
                      {branch?.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleCreateOrUpdate}
            disabled={loading}
            className={`mt-8 w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-3 rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? editingUser
                ? "Updating..."
                : "Creating..."
              : editingUser
              ? "Update User"
              : "Create User"}
          </button>
        </div>

        {/* Table Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#B57C36]">Users List</h2>
          <span className="text-lg bg-[#B57C36]/80 text-white px-3 py-1 rounded-md shadow-md">
            Total Users: {users.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-[#B57C36]/40 rounded-xl shadow-md">
            <thead>
              <tr className="bg-[#B57C36]/10 text-[#B57C36]">
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Username</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Branches</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr
                  key={u.id}
                  className="border-t border-[#B57C36]/20 hover:bg-white/50 transition"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{u.user.username}</td>
                  <td className="p-4">{u.user.email}</td>
                  <td className="p-4">{u.role}</td>
                  <td className="p-4">
                    {u.branches.map((b) => b.name).join(", ")}
                  </td>
                  <td className="p-4 space-x-4">
                    <button
                      onClick={() => startEdit(u)}
                      className="text-blue-500 hover:text-blue-700 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(u)}
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

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-xl rounded-xl p-6 w-80 text-black">
              <p className="mb-4 text-center">
                Are you sure you want to delete{" "}
                <strong>{userToDelete?.user.username}</strong>?
              </p>
              <div className="text-sm text-center mb-4 text-gray-700">
                Assigned to: <br />
                <span className="font-medium text-[#B57C36]">
                  {userToDelete?.branches.map((b) => b.name).join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded bg-white/60 hover:bg-white/80 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmed}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
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

export default Users;
