import React, { useEffect, useMemo, useState } from "react";
import { getProducts, updateProduct, deleteProduct } from "../../utils/api";
import toast from "react-hot-toast";

const StockTracking = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: "",
    selling_price_per_piece: "",
    selling_price_per_pack: "",
    reorder_level: "",
    expiry_date: ""
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (err) {
        toast.error("Failed to fetch products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derived lists
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(term) ||
        (p.sku || "").toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Open modal with product data
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setForm({
      name: product.name ?? "",
      sku: product.sku ?? "",
      quantity: product.quantity ?? "",
      selling_price_per_piece: product.selling_price_per_piece ?? "",
      selling_price_per_pack: product.selling_price_per_pack ?? "",
      reorder_level: product.reorder_level ?? "",
      expiry_date: product.expiry ?? ""
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Save updates to backend and UI
  const handleSave = async () => {
    if (!selectedProduct) return;

    const payload = {
      ...selectedProduct,
      name: form.name,
      sku: form.sku,
      quantity: Number(form.quantity || 0),
      selling_price_per_piece:
        form.selling_price_per_piece === "" ? null : form.selling_price_per_piece,
      selling_price_per_pack:
        form.selling_price_per_pack === "" ? null : form.selling_price_per_pack,
      reorder_level: Number(form.reorder_level || 0),
      expiry_date: form.expiry_date || null
    };

    try {
      const res = await updateProduct(selectedProduct.id, payload);
      const updated = res.data;
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success("Product updated");
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    }
  };

  // Delete with confirmation
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this product? This action cannot be undone.");
    if (!ok) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  // Helpers
  const statusBadge = (p) => {
    const isLow = Number(p.quantity || 0) <= Number(p.reorder_level || 0);
    return (
      <span
        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
          isLow ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}
      >
        {isLow ? "Low Stock" : "OK"}
      </span>
    );
  };

  if (loading) {
    return <div className="p-6">Loading stock data...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass p-6">
        <h1 className="text-3xl font-bold text-[#B57C36]">Stock Tracking</h1>
        <p className="mt-2 text-gray-700">
          Monitor product quantities, selling prices, reorder levels, and expiry dates.
        </p>
      </div>

      {/* Search */}
      <div className="glass p-4">
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
        />
      </div>

      {/* Table */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Product Stock Levels</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#B57C36]/20 text-[#B57C36]">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Selling Price (Piece)</th>
                <th className="p-3 text-left">Selling Price (Pack)</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{p.quantity}</td>
                  <td className="p-3">
                    {p.selling_price_per_piece ?? <span className="text-gray-400">—</span>}
                  </td>
                  <td className="p-3">
                    {p.selling_price_per_pack ?? <span className="text-gray-400">—</span>}
                  </td>
                  <td className="p-3">{statusBadge(p)}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {currentProducts.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={7}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 bg-[#B57C36] text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {Math.max(totalPages, 1)}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 bg-[#B57C36] text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
            aria-hidden="true"
          />
          {/* Dialog */}
          <div className="relative glass w-full max-w-2xl mx-4 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#B57C36]">Edit product</h3>
                <p className="text-sm text-gray-600">
                  Make changes below. Save to persist to the database.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>

            {/* Readable grouped form */}
            <div className="space-y-8">
              {/* Identification */}
              <section>
                <h4 className="text-sm font-semibold text-[#B57C36] mb-3">
                  Identification
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#B57C36]">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full p-2 border rounded bg-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#B57C36]">SKU</label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                      className="w-full p-2 border rounded bg-white/30"
                    />
                  </div>
                </div>
              </section>

              {/* Inventory */}
              <section>
                <h4 className="text-sm font-semibold text-[#B57C36] mb-3">
                  Inventory
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#B57C36]">Quantity</label>
                    <input
                      type="number"
                      value={form.quantity}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, quantity: e.target.value }))
                      }
                      className="w-full p-2 border rounded bg-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#B57C36]">
                      Reorder level
                    </label>
                    <input
                      type="number"
                      value={form.reorder_level}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, reorder_level: e.target.value }))
                      }
                      className="w-full p-2 border rounded bg-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#B57C36]">Expiry date</label>
                    <input
                      type="date"
                      value={form.expiry || ""}
                      onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))}
                      className="w-full p-2 border rounded bg-white/30"
                    />
                  </div>
                </div>
              </section>

              {/* Pricing */}
              <section>
                <h4 className="text-sm font-semibold text-[#B57C36] mb-3">Pricing</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#B57C36]">
                      Selling price per piece
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.selling_price_per_piece}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          selling_price_per_piece: e.target.value
                        }))
                      }
                      className="w-full p-2 border rounded bg-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#B57C36]">
                      Selling price per pack
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.selling_price_per_pack}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          selling_price_per_pack: e.target.value
                        }))
                      }
                      className="w-full p-2 border rounded bg-white/30"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Footer actions */}
            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-300 text-gray-900 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-[#B57C36] text-white hover:bg-[#a06d2f] transition"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTracking;




