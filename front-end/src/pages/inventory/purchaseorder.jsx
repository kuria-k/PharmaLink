import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newOrder, setNewOrder] = useState({
    product: "",
    supplier: "",
    quantity: "",
    expected_delivery: "",
    status: "pending",
  });

  // Fetch orders + products from backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/inventory/purchase-orders/")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setOrders(data || []);
      })
      .catch((err) => console.error("Error fetching purchase orders:", err));

    axios
      .get("http://localhost:8000/api/inventory/products/")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setProducts(data || []);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (create new order)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/inventory/purchase-orders/",
        newOrder
      );

      const createdOrder = res.data;
      setOrders((prev) => [...prev, createdOrder]);

      toast.success("Order was placed successfully!");
      setShowModal(false);
      setNewOrder({
        product: "",
        supplier: "",
        quantity: "",
        expected_delivery: "",
        status: "pending",
      });
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateStatus = (id, status) => {
    axios
      .patch(`http://localhost:8000/api/inventory/purchase-orders/${id}/`, {
        status,
      })
      .then((res) => {
        setOrders((prev) =>
          prev.map((order) => (order.id === id ? res.data : order))
        );
        if (status === "completed") toast.success("Order was completed!");
        if (status === "cancelled") toast.info("Order was cancelled!");
      })
      .catch(() => toast.error("Failed to update order status"));
  };

  return (
    <div className="p-6 space-y-6">
      <ToastContainer />

      {/* Header */}
      <div className="glass p-6 text-center">
        <h1 className="text-3xl font-bold text-[#B57C36]">
           Purchase Orders
        </h1>
        <p className="mt-2 text-gray-700">
          Manage supplier purchase orders, track statuses, and monitor spending.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Total Orders</h2>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">
            Pending Orders
          </h2>
          <p className="text-2xl font-bold">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">
            Total Quantity
          </h2>
          <p className="text-2xl font-bold">
            {orders.reduce((sum, o) => sum + Number(o.quantity || 0), 0)}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass p-6 overflow-x-auto">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Orders List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#B57C36]/20 text-[#B57C36]">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">Expected Delivery</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3">{o.po_number || o.id}</td>
                <td className="p-3">{o.product_name || o.product}</td>
                <td className="p-3">{o.supplier}</td>
                <td className="p-3">{o.expected_delivery}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      o.status === "pending"
                        ? "bg-yellow-500"
                        : o.status === "completed"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="p-3">{o.quantity}</td>
                <td className="p-3 flex gap-2">
                  {o.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(o.id, "completed")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => updateStatus(o.id, "cancelled")}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-4 py-2 rounded-lg"
          >
             Create New Order
          </button>
        </div>
      </div>
      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#B57C36] mb-4">
              New Purchase Order
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Product dropdown */}
              <select
                name="product"
                value={newOrder.product}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>

              {/* Supplier */}
              <input
                type="text"
                name="supplier"
                placeholder="Supplier"
                value={newOrder.supplier}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
              />

              {/* Quantity */}
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={newOrder.quantity}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
              />

              {/* Expected Delivery Date */}
              <input
                type="date"
                name="expected_delivery"
                value={newOrder.expected_delivery}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
              />

              {/* Status dropdown */}
              <select
                name="status"
                value={newOrder.status}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Action buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {loading ? "Saving..." : "Save Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default PurchaseOrders;
