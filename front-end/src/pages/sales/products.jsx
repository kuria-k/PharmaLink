// src/pages/sales/Products.jsx
import React, { useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Paracetamol", sku: "MED001", cost: 5, price: 8 },
    { id: 2, name: "Vitamin C", sku: "MED002", cost: 2, price: 5 },
  ]);

  return (
    <div className="glass p-6">
      <h2 className="text-xl font-bold text-[#B57C36] mb-4">Products</h2>
      <form className="space-y-4 mb-6">
        <input type="text" placeholder="Product Name" className="w-full p-3 rounded-lg border border-[#B57C36]/40" />
        <input type="text" placeholder="SKU" className="w-full p-3 rounded-lg border border-[#B57C36]/40" />
        <input type="number" placeholder="Cost Price" className="w-full p-3 rounded-lg border border-[#B57C36]/40" />
        <input type="number" placeholder="Selling Price" className="w-full p-3 rounded-lg border border-[#B57C36]/40" />
        <button className="bg-[#B57C36] text-white px-4 py-2 rounded-lg">Add Product</button>
      </form>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#B57C36]/20 text-[#B57C36]">
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">SKU</th>
            <th className="p-3 text-left">Cost</th>
            <th className="p-3 text-left">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.sku}</td>
              <td className="p-3">${p.cost}</td>
              <td className="p-3">${p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
