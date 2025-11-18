import React, { useEffect, useState } from "react";
import { getProducts } from "../../utils/api"; 

const StockTracking = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // show 10 products per page

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts(); 
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-6">Loading stock data...</div>;
  }

  // Filter products by search term (name or SKU)
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic (applied to filtered products)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass p-6">
        <h1 className="text-3xl font-bold text-[#B57C36]">Stock Tracking</h1>
        <p className="mt-2 text-gray-700">
          Monitor product quantities, movements, reorder levels, and expiry dates.
        </p>
      </div>

      {/* Search Bar */}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Total Products</h2>
          <p className="text-2xl font-bold">{filteredProducts.length}</p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Low Stock Items</h2>
          <p className="text-2xl font-bold">
            {filteredProducts.filter((p) => p.quantity <= p.reorder_level).length}
          </p>
        </div>
        <div className="glass p-4 text-center">
          <h2 className="text-lg font-semibold text-[#B57C36]">Expiring Soon</h2>
          <p className="text-2xl font-bold">
            {
              filteredProducts.filter(
                (p) => p.expiry && new Date(p.expiry) < new Date("2025-12-31")
              ).length
            }
          </p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Product Stock Levels</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#B57C36]/20 text-[#B57C36]">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Reorder Level</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((p, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.sku}</td>
                <td className="p-3">{p.quantity}</td>
                <td className="p-3">{p.reorder_level}</td>
                <td className="p-3">
                  {p.quantity <= p.reorder_level ? (
                    <span className="text-red-600 font-semibold">Low Stock</span>
                  ) : (
                    <span className="text-green-600 font-semibold">OK</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 bg-[#B57C36] text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 bg-[#B57C36] text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="backdrop-blur-md bg-gradient-to-r from-red-500/70 to-red-700/70 border border-red-300 shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Alerts</h2>
        <ul className="space-y-2 text-white">
          {filteredProducts
            .filter((p) => p.quantity <= p.reorder_level)
            .map((p, idx) => (
              <li key={idx}>
                {p.name} is below reorder level ({p.quantity} left)
              </li>
            ))}
          {filteredProducts
            .filter((p) => p.expiry && new Date(p.expiry) < new Date("2025-12-31"))
            .map((p, idx) => (
              <li key={idx}>
                {p.name} expires on {p.expiry}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default StockTracking;



