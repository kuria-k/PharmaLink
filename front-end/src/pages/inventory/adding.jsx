import React, { useState } from "react";
import axios from "axios"; 

const AddInventoryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    supplier: "",
    quantity: 0,
    price_per_pack: "",
    price_per_piece: "",
    selling_price_per_pack: "",
    selling_price_per_piece: "",
    unit_type: "pack",
    pieces_per_pack: 1,
    daily_usage: 5,
    lead_time: 10,
    safety_stock: 10,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Utility: generate SKU abbreviation from product name
  const generateSKU = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].substring(0, 5).toUpperCase();
    }
    return (
      words[0].substring(0, 3).toUpperCase() +
      words[1].substring(0, 2).toUpperCase()
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" && { sku: generateSKU(value) }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.supplier.trim() ||
      !formData.price_per_pack
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category: formData.category.trim(),
        supplier: formData.supplier.trim(),
        quantity: parseInt(formData.quantity, 10),
        pieces_per_pack: parseInt(formData.pieces_per_pack, 10),
        daily_usage: parseInt(formData.daily_usage, 10),
        lead_time: parseInt(formData.lead_time, 10),
        safety_stock: parseInt(formData.safety_stock, 10),
        price_per_pack: parseFloat(formData.price_per_pack),
        price_per_piece: formData.price_per_piece
          ? parseFloat(formData.price_per_piece)
          : null,
        selling_price_per_pack: formData.selling_price_per_pack
          ? parseFloat(formData.selling_price_per_pack)
          : null,
        selling_price_per_piece: formData.selling_price_per_piece
          ? parseFloat(formData.selling_price_per_piece)
          : null,
      };

      // Call the upsert endpoint instead of plain create
      await axios.post(
        "http://localhost:8000/api/inventory/products/add-or-update/",
        payload
      );

      setMessage("Product saved successfully!");
      setFormData({
        name: "",
        sku: "",
        category: "",
        supplier: "",
        quantity: 0,
        price_per_pack: "",
        price_per_piece: "",
        selling_price_per_pack: "",
        selling_price_per_piece: "",
        unit_type: "pack",
        pieces_per_pack: 1,
        daily_usage: 5,
        lead_time: 10,
        safety_stock: 10,
      });
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
      setMessage(
        "Failed to save product. " +
          (err.response?.data ? JSON.stringify(err.response.data) : "")
      );
    } finally {
      setLoading(false);
    }
  };
  
    return (
    <div className="p-6">
      <div className="glass p-6">
        <h1 className="text-2xl font-bold text-[#B57C36] mb-6">Add Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-[#B57C36] mb-2">Basic Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="p-3 rounded-lg bg-white/50 border border-[#B57C36]/40" />
              <input type="text" name="sku" placeholder="SKU (auto-generated)" value={formData.sku || ""} readOnly className="p-3 rounded-lg bg-gray-100 border border-[#B57C36]/40" />
              <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="p-3 rounded-lg bg-white/50 border border-[#B57C36]/40" />
              <input type="text" name="supplier" placeholder="Supplier" value={formData.supplier} onChange={handleChange} className="p-3 rounded-lg bg-white/50 border border-[#B57C36]/40" />
            </div>
          </div>

          {/* Quantity & Pricing */}
          <div>
            <h2 className="text-lg font-semibold text-[#B57C36] mb-2">Quantity & Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="p-3 rounded-lg bg-white/50 border border-[#B57C36]/40" />
              <input type="number" step="0.01" name="price_per_pack" placeholder="Buying Price per Pack" value={formData.price_per_pack} onChange={handleChange} className="p-3 rounded-lg bg-white/50 border border-[#B57C36]/40" />
              <input type="number" step="0.01" name="price_per_piece" placeholder="Buying Price per Piece (optional)" value={formData.price_per_piece} onChange={handleChange} className="p-3 rounded-lg bg-white/50 border border-[#B57C36]/40" />
              <input type="number" step="0.01" name="selling_price_per_pack" placeholder="Selling Price per Pack" value={formData.selling_price_per_pack} onChange={handleChange} className="p-3 rounded-lg bg-white/50 border border-[#B57C36]/40" />
              <input type="number" step="0.01" name="selling_price_per_piece" placeholder="Selling Price per Piece (optional)" value={formData.selling_price_per_piece} onChange={handleChange} className="p-3 rounded-lg bg-white/50 border border-[#B57C36]/40" />
            </div>
          </div>

          {/* Unit Breakdown */}
          <div>
            <h2 className="text-lg font-semibold text-[#B57C36] mb-2">Unit Breakdown</h2>
            <div className="grid grid-cols-2 gap-4">
              <select name="unit_type" value={formData.unit_type} onChange={handleChange} className="p-3 rounded-lg bg-white/50 border border-[#B57C36]/40">
                <option value="pack">Pack</option>
                <option value="piece">Piece</option>
              </select>
              <input type="number" name="pieces_per_pack" placeholder="Pieces per Pack" value={formData.pieces_per_pack} onChange={handleChange} className="p-3 rounded-lg bg-white/50 border border-[#B57C36]/40" />
            </div>
          </div>

          {/* Inventory Control */}
          <div>
            <h2 className="text-lg font-semibold text-[#B57C36] mb-2">Inventory Control</h2>
            <div className="grid grid-cols-3 gap-4">
              <input type="number" name="daily_usage" placeholder="Daily Usage" value={formData.daily_usage} onChange={handleChange} min="0" className="p-3 rounded-lg bg-white/50 border border-[#B57C36]/40 focus:ring-2 focus:ring-[#B57C36]" />
              <input type="number" name="lead_time" placeholder="Lead Time (days)" value={formData.lead_time} onChange={handleChange} min="0" className="p-3 rounded-lg bg-white/50 border border-[#B57C36]/40 focus:ring-2 focus:ring-[#B57C36]" />
              <input type="number" name="safety_stock" placeholder="Safety Stock" value={formData.safety_stock} onChange={handleChange} min="0" className="p-3 rounded-lg bg-white/50 border border-[#B57C36]/40 focus:ring-2 focus:ring-[#B57C36]" />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-2 rounded-lg flex items-center justify-center transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                    ></path>
                  </svg>
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Product"
              )}
            </button>

            {/* Feedback message */}
            {message && (
              <p
                className={`mt-4 text-center text-sm ${
                  message.includes("successfully")
                    ? "text-green-600 font-medium"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInventoryForm;


