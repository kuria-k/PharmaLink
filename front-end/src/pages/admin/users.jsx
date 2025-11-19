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
  const [searchTerm, setSearchTerm] = useState("");

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
      toast.error("Failed to load users");
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await api.get("/branches/");
      setBranches(res.data);
    } catch (err) {
      toast.error("Failed to load branches");
    }
  };

  const handleCreateOrUpdate = async () => {
    setLoading(true);

    // Build payload dynamically
    let payload = {};

    if (editingUser) {
      // Only include fields that changed
      const userPayload = {};

      if (
        formData.username &&
        formData.username !== editingUser.user.username
      ) {
        userPayload.username = formData.username.trim();
      }
      if (formData.email && formData.email !== editingUser.user.email) {
        userPayload.email = formData.email.trim();
      }
      if (formData.password) {
        userPayload.password = formData.password;
      }

      if (Object.keys(userPayload).length > 0) {
        payload.user = userPayload;
      }

      if (formData.role && formData.role !== editingUser.role) {
        payload.role = formData.role;
      }

      // Compare branches
      const currentBranchIds = editingUser.branches.map((b) => b.id.toString());
      if (
        JSON.stringify(currentBranchIds.sort()) !==
        JSON.stringify(formData.branches.sort())
      ) {
        payload.branch_ids = formData.branches.map(Number);
      }

      try {
        await api.patch(`/profiles/${editingUser.id}/`, payload);
        toast.success("User updated successfully");
      } catch (error) {
        console.error("Update error:", error.response?.data || error.message);
        toast.error("Failed to update user");
      }
    } else {
      // Create new user (send all fields)
      payload = {
        user: {
          username: formData.username.trim(),
          email: formData.email.trim(),
          ...(formData.password ? { password: formData.password } : {}),
        },
        role: formData.role,
        branch_ids: formData.branches.map(Number),
      };

      try {
        await api.post("/profiles/", payload);
        toast.success("User created successfully");
      } catch (error) {
        console.error("Create error:", error.response?.data || error.message);
        toast.error("Failed to create user");
      }
    }

    resetForm();
    fetchUsers();
    setShowModal(false);
    setLoading(false);
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
      branches: user.branches.map((b) => String(b.id)),
    });
    setShowModal(true);
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
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setShowModal(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-white via-white/80 to-white/60 p-6">
      <div className="w-full max-w-5xl bg-white/90 rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#B57C36] mb-8 text-center">
          Manage Users
        </h1>
        {/* Create User Form */}
        <div className="bg-white/70 rounded-xl shadow-md p-8 mt-12">
          <h2 className="text-2xl font-semibold text-[#B57C36] mb-6 text-center">
            Create User
          </h2>
          {/* Username */}
          <input
            className="w-full p-3 mb-4 rounded-lg border border-[#B57C36]/40 bg-white text-black"
            placeholder="Enter username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          {/* Email */}
          <input
            className="w-full p-3 mb-4 rounded-lg border border-[#B57C36]/40 bg-white text-black"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {/* Password */}
          <input
            type="password"
            className="w-full p-3 mb-4 rounded-lg border border-[#B57C36]/40 bg-white text-black"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {/* Role */}
          <select
            className="w-full p-3 mb-4 rounded-lg border border-[#B57C36]/40 bg-white text-black"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="">--Select Role--</option>
            <option value="cashier">Cashier</option>
            <option value="sales">Sales</option>
            <option value="inventory">Inventory</option>
            <option value="admin">Admin</option>
          </select>
          {/* Branches */}
          <div className="max-h-48 overflow-y-auto border border-[#B57C36]/40 rounded-lg bg-white p-3 space-y-2">
            {branches.map((b) => (
              <label key={b.id} className="flex items-center space-x-2">
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
          {/* Submit */}
          <button
            onClick={handleCreateOrUpdate}
            disabled={loading}
            className={`mt-8 w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-3 rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>{" "}
        <br />
        <br />
        <br />
        <br />
        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg border border-[#B57C36]/40 bg-white text-black"
          />
        </div>
        {/* Users table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FDF6F0] text-[#B57C36]">
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Branches</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.user.username}</td>
                <td className="p-3">{user.user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  {user.branches.map((b) => b.name).join(", ")}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => startEdit(user)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(user)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Edit Modal */}
        {showModal && editingUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
              <h2 className="text-2xl font-semibold text-[#B57C36] mb-6 text-center">
                Update User
              </h2>

              {/* Username */}
              <label className="block text-sm font-medium text-[#B57C36] mb-2">
                Username
              </label>
              <input
                className="w-full p-3 mb-4 rounded-lg border border-[#B57C36]/40 bg-white/80 text-black"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />

              {/* Email */}
              <label className="block text-sm font-medium text-[#B57C36] mb-2">
                Email
              </label>
              <input
                className="w-full p-3 mb-4 rounded-lg border border-[#B57C36]/40 bg-white/80 text-black"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              {/* Password */}
              <label className="block text-sm font-medium text-[#B57C36] mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 mb-4 rounded-lg border border-[#B57C36]/40 bg-white/80 text-black"
                placeholder="New password (optional)"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              {/* Role */}
              <label className="block text-sm font-medium text-[#B57C36] mb-2">
                Role
              </label>
              <select
                className="w-full p-3 mb-4 rounded-lg border border-[#B57C36]/40 bg-white/80 text-black"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="">--Select Role--</option>
                <option value="cashier">Cashier</option>
                <option value="sales">Sales</option>
                <option value="inventory">Inventory</option>
                <option value="admin">Admin</option>
              </select>

              {/* Branches */}
              <label className="block text-sm font-medium text-[#B57C36] mb-2">
                Branches
              </label>
              <div className="max-h-48 overflow-y-auto border border-[#B57C36]/40 rounded-lg bg-white/80 p-3 space-y-2 mb-4">
                {branches.map((b) => (
                  <label key={b.id} className="flex items-center space-x-2">
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

              {/* Update Button */}
              <button
                onClick={handleCreateOrUpdate}
                disabled={loading}
                className={`mt-4 w-full bg-[#B57C36]/90 hover:bg-[#9E6B2F]/90 text-white font-semibold py-3 rounded-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Update User"}
              </button>

              {/* Cancel Button */}
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="mt-3 w-full bg-gray-200/70 hover:bg-gray-300/80 text-black font-semibold py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {showModal && userToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-8 w-full max-w-md">
              <h2 className="text-xl font-semibold text-[#B57C36] mb-6 text-center">
                Confirm Delete
              </h2>
              <p className="text-center mb-6 text-black">
                Are you sure you want to delete{" "}
                <span className="font-bold">{userToDelete.user.username}</span>?
              </p>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={handleDeleteConfirmed}
                  className="w-1/2 bg-red-500/80 hover:bg-red-600/90 text-white font-semibold py-2 rounded-lg backdrop-blur-sm"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setUserToDelete(null);
                  }}
                  className="w-1/2 bg-gray-200/60 hover:bg-gray-300/70 text-black font-semibold py-2 rounded-lg backdrop-blur-sm"
                >
                  Cancel
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
