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

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

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

    let payload = {};

    if (editingUser) {
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
        toast.error("Failed to update user");
      }
    } else {
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

  // SEARCH FILTER
  const filteredUsers = users.filter(
    (u) =>
      u.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (num) => setCurrentPage(num);

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-xl p-6 md:p-10">

        <h1 className="text-3xl font-bold text-[#B57C36] mb-6 text-center">
          Manage Users
        </h1>

        {/* CREATE USER */}
        <div className="bg-white border border-[#B57C36]/30 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-[#B57C36] mb-4">Create User</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="p-3 rounded-lg border border-[#B57C36]/40"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />

            <input
              className="p-3 rounded-lg border border-[#B57C36]/40"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              type="password"
              className="p-3 rounded-lg border border-[#B57C36]/40"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <select
              className="p-3 rounded-lg border border-[#B57C36]/40"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="">--Select Role--</option>
              <option value="cashier">Cashier</option>
              <option value="sales">Sales</option>
              <option value="inventory">Inventory</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* BRANCHES */}
          <div className="mt-4 max-h-40 overflow-y-auto border border-[#B57C36]/40 rounded-lg p-3">
            {branches.map((b) => (
              <label key={b.id} className="flex items-center gap-2">
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
                <span>{b.name}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleCreateOrUpdate}
            className="mt-6 w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white py-3 rounded-lg"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="mt-10 mb-4">
          <input
            className="w-full p-3 rounded-lg border border-[#B57C36]/40"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset page when searching
            }}
          />
        </div>

        {/* RESPONSIVE TABLE */}
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="w-full table-auto text-left">
            <thead className="bg-[#FDF6F0] sticky top-0">
              <tr className="text-[#B57C36]">
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Branches</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.user.username}</td>
                  <td className="p-3">{user.user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">
                    {user.branches.map((b) => b.name).join(", ")}
                  </td>
                  <td className="p-3 flex gap-2">
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

          {/* NO USERS */}
          {paginatedUsers.length === 0 && (
            <p className="text-center p-6 text-gray-500">No users found.</p>
          )}
        </div>

        {/* PAGINATION */}
        <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
          {/* Items per page */}
          <select
            className="border p-2 rounded"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 7, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                Show {n}
              </option>
            ))}
          </select>

          {/* Page buttons */}
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-[#B57C36] text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* MODALS (Edit + Delete) */}
        {showModal && (editingUser || userToDelete) && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">

            {/* EDIT MODAL */}
            {editingUser && (
              <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h2 className="text-xl font-bold text-[#B57C36] mb-4 text-center">
                  Update User
                </h2>

                <input
                  className="w-full p-3 mb-3 rounded-lg border"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />

                <input
                  className="w-full p-3 mb-3 rounded-lg border"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                <input
                  type="password"
                  placeholder="New password (optional)"
                  className="w-full p-3 mb-3 rounded-lg border"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                <select
                  className="w-full p-3 mb-3 rounded-lg border"
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

                <div className="max-h-40 overflow-y-auto border p-3 rounded-lg mb-4">
                  {branches.map((b) => (
                    <label key={b.id} className="flex items-center gap-2">
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
                      />
                      <span>{b.name}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleCreateOrUpdate}
                  className="w-full bg-[#B57C36] text-white py-3 rounded-lg"
                >
                  Update
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full mt-3 bg-gray-200 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* DELETE MODAL */}
            {userToDelete && (
              <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
                <h2 className="text-xl font-bold text-red-600 mb-4">
                  Confirm Delete
                </h2>
                <p className="mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-bold">
                    {userToDelete.user.username}
                  </span>
                  ?
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={handleDeleteConfirmed}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default Users;

