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
    role: "cashier",
    branches: [],
  });

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get("/profiles/");
    setUsers(res.data);
  };

  const fetchBranches = async () => {
    const res = await api.get("/branches/");
    setBranches(res.data);
  };

  const handleCreateOrUpdate = async () => {
    setLoading(true);
    const payload = {
      user: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      },
      role: formData.role,
      branches: formData.branches.map(Number),
    };

    try {
      if (editingUser) {
        await api.put(`/profiles/${editingUser.id}/`, payload);
        toast.success("User updated");
      } else {
        await api.post("/profiles/", payload);
        toast.success("User created");
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Save user error:", error.response?.data || error.message);
      toast.error("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "cashier",
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
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/profiles/${userToDelete.id}/`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
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

        {/* Form Section */}
        <div className="bg-white/70 rounded-lg shadow-md p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className="w-full p-3 rounded-lg border border-[#B57C36]/40 bg-white text-black"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <input
              className="w-full p-3 rounded-lg border border-[#B57C36]/40 bg-white text-black"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="password"
              className="w-full p-3 rounded-lg border border-[#B57C36]/40 bg-white text-black"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <select
              className="w-full p-3 rounded-lg border border-[#B57C36]/40 bg-white text-black"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="cashier">Cashier</option>
              <option value="sales">Sales</option>
              <option value="inventory">Inventory</option>
            </select>
            <select
              multiple
              className="w-full p-3 rounded-lg border border-[#B57C36]/40 bg-white text-black"
              value={formData.branches}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  branches: Array.from(
                    e.target.selectedOptions,
                    (opt) => opt.value
                  ),
                })
              }
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreateOrUpdate}
            disabled={loading}
            className={`mt-6 w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-3 rounded-lg ${
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
          <span className="text-sm text-gray-600">
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