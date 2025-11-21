import React, { useState, useEffect, useMemo } from "react";
import { getProducts, createSale, getCustomers } from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";

const emptyItem = {
  product: "",
  quantity: 1,
  price: 0,
  vat: 16,
  discount: 0,
  unit: "w",
};

const formatKES = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 2,
  }).format(value);

const PosSaleDashboard = () => {
  const [products, setProducts] = useState([]);
  const [item, setItem] = useState(emptyItem);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [details, setDetails] = useState({
    saleType: "Cash",
    clientName: "",
    clientNumber: "",
    kraPin: "",
    reference: "",
    comments: "",
    priority: "Normal",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [saleType, setSaleType] = useState("Cash");
  const [clientName, setClientName] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [kraPin, setKraPin] = useState("");
  const [reference, setReference] = useState("");
  const [comments, setComments] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const filteredProducts =
    query === ""
      ? []
      : products.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );

  const addItem = () => {
    if (!item.product) return;
    setItems((prev) => [...prev, { ...item, vat: item.vat || 16 }]);
    setItem(emptyItem);
    setQuery("");
  };

  const totals = useMemo(() => {
    return items.reduce(
      (acc, it) => {
        const lineTotal = it.quantity * it.price;

        // discount applied first
        const discountAmount = (it.discount / 100) * lineTotal;
        const taxable = Math.max(lineTotal - discountAmount, 0);

        // default VAT = 16 if not provided
        const vatRate = it.vat !== undefined && it.vat !== null ? it.vat : 16;
        const vatAmount = (vatRate / 100) * taxable;

        // final nett = discounted + VAT
        const nett = taxable + vatAmount;

        acc.total += lineTotal;
        acc.discount += discountAmount;
        acc.vat += vatAmount;
        acc.nett += nett;
        acc.qty += it.quantity;
        return acc;
      },
      { total: 0, discount: 0, vat: 0, nett: 0, qty: 0 }
    );
  }, [items]);

  const generateReceiptNumber = () => {
    const yearSuffix = new Date().getFullYear().toString().slice(-2);
    const prefix = `CS0${yearSuffix}`;
    const sequence = String(items.length).padStart(7, "0");
    return `${prefix}${sequence}`;
  };

  //  Posting logic
  // const handleSaveSale = async () => {
  //   try {
  //     const payload = {
  //       customer_name: details.clientName || "Walk-in",
  //       total_amount: totals.nett,
  //       invoice_number: generateReceiptNumber(),
  //       items: items.map((it) => ({
  //         product: it.product, // product ID
  //         quantity: it.quantity,
  //         unit: it.unit,
  //         price: it.price,
  //       })),
  //     };

  //     await createSale(payload);

  //     toast.success("Sale posted successfully!", {
  //       style: {
  //         background: "#22c55e",
  //         color: "#064e3b",
  //         fontWeight: "bold",
  //       },
  //     });

  //     setShowConfirm(false);
  //     setShowInvoice(false);
  //     setItems([]); // reset cart
  //   } catch (err) {
  //     toast.error("Failed to post sale");
  //     console.error(err);
  //   }
  // };
  const handleSaveSale = async () => {
  try {
    const payload = {
      customer_name: clientName || "Walk-in",
      client_number: clientNumber || "",
      item_inputs: items.map((it) => ({
        product: it.product,
        quantity: it.quantity,
        unit: it.unit,
        vat: it.vat || 16,
        discount: it.discount || 0,
      })),
    };

    const response = await createSale(payload);
    console.log("Sale response:", response);

    const invoice = response?.data?.invoice_number || "N/A";
    const total = response?.data?.total_amount || 0;

    toast.success(
      `Sale posted successfully! Invoice: ${invoice}, Total: ${formatKES(total)}`,
      {
        style: {
          background: "#22c55e",
          color: "#064e3b",
          fontWeight: "bold",
        },
      }
    );

    setShowConfirm(false);
    setShowInvoice(true);
    setItems([]);
  } catch (err) {
    console.error("Sale post error:", err.response?.data || err.message);
    toast.error("Failed to post sale");
  }
};


  return (
    <section className="bg-gray-50 rounded-lg border shadow-md p-6">
      <div className="grid grid-cols-4 gap-6">
        {/* Left Side: Section 1 + Section 2 */}
        <div className="col-span-3 space-y-10">
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#B57C36] mb-6">
              Sale Details
            </h2>
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-4">
                {/* Sale Type */}
                <div>
                  <label className="text-sm font-medium text-[#B57C36]">
                    Sale Type
                  </label>
                  <select
                    className="w-full border rounded-lg p-3"
                    value={saleType}
                    onChange={(e) => setSaleType(e.target.value)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit">Credit</option>
                    <option value="Insurance">Insurance</option>
                  </select>
                </div>

                {/* Client Name (search + auto-fill number) */}
                <div className="relative">
                  <label className="text-sm font-medium text-[#B57C36]">
                    Client Name (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3"
                    placeholder="Enter client name"
                    value={clientName}
                    onChange={async (e) => {
                      const value = e.target.value;
                      setClientName(value);

                      if (value.length >= 1) {
                        try {
                          const res = await getCustomers();
                          console.log("API response:", res.data);
                          const matches = res.data.filter((c) =>
                            c.name.toLowerCase().includes(value.toLowerCase())
                          );
                          setSuggestions(matches);
                        } catch (err) {
                          console.error("Error fetching customers:", err);
                        }
                      } else {
                        setSuggestions([]);
                      }
                    }}
                  />
                  {/* Suggestions dropdown */}
                  {suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto">
                      {suggestions.map((cust) => (
                        <li
                          key={cust.id}
                          className="p-2 hover:bg-[#B57C36]/10 cursor-pointer"
                          onClick={() => {
                            setClientName(cust.name);
                            // 👇 use the correct field from your API
                            setClientNumber(
                              cust.number ||
                                cust.client_number ||
                                cust.phone ||
                                ""
                            );
                            setSuggestions([]); // hide dropdown
                          }}
                        >
                          {cust.name} —{" "}
                          {cust.number || cust.client_number || cust.phone}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Client Number (auto-filled) */}
                <div>
                  <label className="text-sm font-medium text-[#B57C36]">
                    Client Number (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3"
                    placeholder="Enter client number"
                    value={clientNumber}
                    onChange={(e) => setClientNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* KRA PIN */}
                <div>
                  <label className="text-sm font-medium text-[#B57C36]">
                    KRA PIN (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3"
                    placeholder="Enter KRA PIN"
                    value={kraPin}
                    onChange={(e) => setKraPin(e.target.value)}
                  />
                </div>

                {/* Reference */}
                <div>
                  <label className="text-sm font-medium text-[#B57C36]">
                    Reference
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3"
                    placeholder="Reference number"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>

                {/* Comments */}
                <div>
                  <label className="text-sm font-medium text-[#B57C36]">
                    Comments
                  </label>
                  <textarea
                    className="w-full border rounded-lg p-3"
                    placeholder="Any notes..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Item Entry */}
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#B57C36] mb-6">
              Billing / Item Entry
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* SKU */}
              <div>
                <label className="text-xs font-medium text-[#B57C36]">
                  SKU
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2 bg-gray-100"
                  value={item.sku || ""}
                  readOnly
                />
              </div>

              {/* Item Search */}
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-[#B57C36]">
                  Item Search
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  placeholder="Search drug..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                {query && (
                  <div className="mt-2 max-h-40 overflow-y-auto border rounded bg-white shadow">
                    <table className="w-full text-xs">
                      <thead className="bg-[#B57C36]/10">
                        <tr>
                          <th className="p-2 border">Item</th>
                          <th className="p-2 border">Pack Size</th>
                          <th className="p-2 border">Available Packs</th>
                          <th className="p-2 border">Available Pieces</th>
                          <th className="p-2 border">Pack Price</th>
                          <th className="p-2 border">Piece Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((drug) => (
                          <tr
                            key={drug.id}
                            className="cursor-pointer hover:bg-[#B57C36]/10"
                            onClick={() =>
                              setItem({
                                product: drug.id,
                                sku: drug.sku,
                                name: drug.name,

                                // Stock values
                                availablePacks: drug.stock.available_packs,
                                availablePieces: drug.stock.available_pieces,

                                unit: "w", // default whole pack
                                quantity: 1,

                                // Pricing
                                price:
                                  drug.selling_price_per_pack ??
                                  drug.price_per_pack,

                                // ✅ Always default VAT to 16%
                                vat: 16,

                                // ✅ Default discount to 0
                                discount: 0,
                              })
                            }
                          >
                            <td className="p-2 border">{drug.name}</td>
                            <td className="p-2 border">
                              {drug.pieces_per_pack}
                            </td>
                            <td className="p-2 border">
                              {drug.stock.available_packs}
                            </td>
                            <td className="p-2 border">
                              {drug.stock.available_pieces}
                            </td>
                            <td className="p-2 border">
                              {formatKES(
                                drug.selling_price_per_pack ||
                                  drug.price_per_pack
                              )}
                            </td>
                            <td className="p-2 border">
                              {formatKES(
                                drug.selling_price_per_piece ||
                                  drug.price_per_piece
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ✅ Add Item button */}
                {item.product && (
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-[#B57C36] text-white rounded"
                    onClick={addItem}
                  >
                    Add Item
                  </button>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-[#B57C36]">
                  Quantity
                </label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={item.quantity}
                  onChange={(e) => {
                    const qty = Number(e.target.value);
                    if (item.unit === "p" && qty > item.availablePieces) {
                      toast.error(
                        `${item.name} - ${item.sku} has only ${item.availablePieces} pieces left`
                      );
                      return;
                    }
                    if (item.unit === "w" && qty > item.availablePacks) {
                      toast.error(
                        `${item.name} - ${item.sku} has only ${item.availablePacks} packs left`
                      );
                      return;
                    }
                    setItem((prev) => ({ ...prev, quantity: qty }));
                  }}
                />
              </div>

              {/* Unit */}
              <div>
                <label className="text-xs font-medium text-[#B57C36]">
                  Unit
                </label>
                <select
                  className="w-full border rounded p-2"
                  value={item.unit}
                  onChange={(e) => {
                    const unit = e.target.value;
                    const selectedProduct = products.find(
                      (p) => p.id === item.product
                    );
                    setItem((prev) => ({
                      ...prev,
                      unit,
                      price:
                        unit === "p"
                          ? selectedProduct?.selling_price_per_piece ??
                            selectedProduct?.price_per_piece
                          : selectedProduct?.selling_price_per_pack ??
                            selectedProduct?.price_per_pack,
                    }));
                  }}
                >
                  <option value="w">Whole Pack</option>
                  <option value="p">Piece</option>
                </select>
              </div>
              {/* VAT (fixed at 16%) */}
              <div>
                <label className="text-xs font-medium text-[#B57C36]">
                  VAT %
                </label>
                <input
                  type="number"
                  className="w-full border rounded p-2 bg-gray-100"
                  value={item.vat} // ✅ bind to state
                  readOnly // keep it locked if you don’t want users to change
                />
              </div>

              {/* Discount (max 15%) */}
              <div>
                <label className="text-xs font-medium text-[#B57C36]">
                  Discount %
                </label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={item.discount}
                  onChange={(e) => {
                    const discount = Number(e.target.value);
                    if (discount > 15) {
                      toast.error("Discount cannot exceed 15%");
                      return;
                    }
                    setItem((prev) => ({ ...prev, discount }));
                  }}
                />
              </div>

              {/* Total Price */}
              <div>
                <label className="text-xs font-medium text-[#B57C36]">
                  Total Price
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2 bg-gray-100"
                  value={formatKES(item.quantity * item.price)}
                  readOnly
                />
              </div>

              {/* Add Button */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    // Validate stock again before adding
                    if (
                      item.unit === "p" &&
                      item.quantity > item.availablePieces
                    ) {
                      alert(
                        `Cannot add. Only ${item.availablePieces} pieces available.`
                      );
                      return;
                    }
                    if (
                      item.unit === "w" &&
                      item.quantity > item.availablePacks
                    ) {
                      alert(
                        `Cannot add. Only ${item.availablePacks} packs available.`
                      );
                      return;
                    }

                    // Add to items table
                    setItems((prev) => [...prev, item]);

                    // Reset form
                    setItem({
                      sku: "",
                      name: "",
                      product: null,
                      quantity: 1,
                      unit: "w",
                      price: 0,
                      vat: 0,
                      discount: 0,
                      availablePacks: 0,
                      availablePieces: 0,
                    });
                    setQuery("");
                  }}
                  className="w-full bg-[#B57C36] text-white rounded p-2 hover:bg-[#a06a2f]"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Items Table */}
            {items.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#B57C36] mb-2">
                  Added Items
                </h3>
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead className="bg-[#B57C36]/10">
                    <tr>
                      <th className="border p-2">Drug Name</th>
                      <th className="border p-2">Quantity</th>
                      <th className="border p-2">Unit</th>
                      <th className="border p-2">Discount</th>
                      <th className="border p-2">VAT</th>
                      <th className="border p-2">Total</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => {
                      const total = it.quantity * it.price;
                      const discount = (it.discount / 100) * total;
                      const taxable = Math.max(total - discount, 0);
                      const vat = (it.vat / 100) * taxable;
                      const nett = taxable + vat;

                      return (
                        <tr key={idx}>
                          <td className="border p-2">{it.name}</td>
                          <td className="border p-2">{it.quantity}</td>
                          <td className="border p-2">
                            {it.unit === "w" ? "Pack" : "Piece"}
                          </td>
                          <td className="border p-2">{it.discount}%</td>
                          <td className="border p-2">{it.vat}%</td>
                          <td className="border p-2">{formatKES(nett)}</td>
                          <td className="border p-2 space-x-2">
                            {/* Edit button */}
                            <button
                              onClick={() => {
                                // Load item back into form for editing
                                setItem(it);
                                // Remove from list temporarily
                                setItems(items.filter((_, i) => i !== idx));
                              }}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this item?"
                                  )
                                ) {
                                  setItems(items.filter((_, i) => i !== idx));
                                }
                              }}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 bg-white rounded-lg border shadow-sm p-4 text-xs">
          {/* Header */}
          <h2 className="text-sm font-semibold text-[#B57C36] mb-3">
            Cash Sale Summary
          </h2>

          {/* Sale Details */}
          <div className="space-y-1 mb-4">
            <p>
              <span className="text-gray-500">Sale Type: </span>
              <span className="font-semibold">
                {details.saleType || "Cash"}
              </span>
            </p>
            <p>
              <span className="text-gray-500">Client Name: </span>
              <span className="font-semibold">
                {details.clientName || "N/A"}
              </span>
            </p>
            <p>
              <span className="text-gray-500">Client Number: </span>
              <span className="font-semibold">
                {details.clientNumber || "N/A"}
              </span>
            </p>
            <p>
              <span className="text-gray-500">KRA PIN: </span>
              <span className="font-semibold">{details.kraPin || "N/A"}</span>
            </p>
            <p>
              <span className="text-gray-500">Reference: </span>
              <span className="font-semibold">
                {details.reference || "N/A"}
              </span>
            </p>
            <p>
              <span className="text-gray-500">Comments: </span>
              <span className="font-semibold">
                {details.comments || "None"}
              </span>
            </p>
          </div>

          {/* Top summary grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border p-3">
              <div className="text-xs text-gray-500">Currency</div>
              <div className="font-semibold">Kshs</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-gray-500">ExchRate</div>
              <div className="font-semibold">1</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-gray-500">Tax Rate</div>
              <div className="font-semibold">16%</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-gray-500">Priority</div>
              <div className="font-semibold">
                {details.priority || "Normal"}
              </div>
            </div>
          </div>

          {/* Totals grid */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-md border p-3">
              <div className="text-xs text-gray-500">Discount</div>
              <div className="font-semibold text-red-600">
                {formatKES(totals.discount)}
              </div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-gray-500">Total excl</div>
              <div className="font-semibold text-green-700">
                {formatKES(totals.total)}
              </div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-gray-500">VAT (16%)</div>
              <div className="font-semibold text-black">
                {formatKES(totals.vat)}
              </div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-gray-500">Nett</div>
              <div className="font-semibold text-green-700">
                {formatKES(totals.nett)}
              </div>
            </div>
          </div>

          {/* Line item summary */}
          <div className="mt-4 rounded-md border p-3">
            <div className="text-sm font-semibold text-gray-700">
              Line Item Summary
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Qty: </span>
                <span className="font-semibold">{totals.qty}</span>
              </div>
              <div>
                <span className="text-gray-500">Price: </span>
                <span className="font-semibold text-green-700">
                  {formatKES(totals.total)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Disc: </span>
                <span className="font-semibold text-red-600">
                  {formatKES(totals.discount)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Price Excl: </span>
                <span className="font-semibold text-gray-800">
                  {formatKES(Math.max(totals.total - totals.discount, 0))}
                </span>
              </div>
              <div>
                <span className="text-gray-500">VAT: </span>
                <span className="font-semibold text-black">
                  {formatKES(totals.vat)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Nett: </span>
                <span className="font-semibold text-green-700">
                  {formatKES(totals.nett)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Action buttons */}
        <div className="mt-4 flex gap-3">
          <button
            className="bg-[#B57C36] text-white px-4 py-2 rounded shadow"
            onClick={() => setShowConfirm(true)}
          >
            Post Sale
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
            onClick={() => setShowInvoice(true)}
          >
            Invoice
          </button>
        </div>

        {/* Confirm Modal */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-[#B57C36] mb-4">
                Confirm Sale Posting
              </h2>
              <p className="text-sm mb-6">
                Are you sure you want to post this sale?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#B57C36] text-white px-4 py-2 rounded"
                  onClick={handleSaveSale}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Modal */}
        {showInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-[800px] relative">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-black"
                onClick={() => setShowInvoice(false)}
              >
                ✖
              </button>

              {/* Header */}
              <header className="border-b pb-4 mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#B57C36]">Invoice</h1>
                <div className="text-right text-sm">
                  <p>
                    <strong>Golden Coffee Ltd.</strong>
                  </p>
                  <p>123 Business Street</p>
                  <p>Nairobi, Kenya</p>
                  <p>Email: info@golden-coffee.com</p>
                </div>
              </header>

              {/* Client Info */}
              <section className="mb-4 text-sm">
                <p>
                  <strong>Client:</strong> {details.clientName}
                </p>
                <p>
                  <strong>Client Number:</strong> {details.clientNumber}
                </p>
                <p>
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </p>
                <p>
                  <strong>Reference:</strong> {details.reference}
                </p>
              </section>

              {/* Items Table */}
              <table className="w-full border-collapse mb-6 text-sm">
                <thead>
                  <tr className="bg-[#B57C36] text-white">
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Qty</th>
                    <th className="p-2 text-left">Unit Price</th>
                    <th className="p-2 text-left">Discount</th>
                    <th className="p-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{it.name || it.description}</td>
                      <td className="p-2">{it.quantity}</td>
                      <td className="p-2">{formatKES(it.price)}</td>
                      <td className="p-2 text-red-600">
                        {it.discount ? formatKES(it.discount) : "-"}
                      </td>
                      <td className="p-2">
                        {formatKES(it.quantity * it.price - (it.discount || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="text-right mb-6">
                <p>
                  <strong>Subtotal:</strong> {formatKES(totals.total)}
                </p>
                <p>
                  <strong>Discount:</strong> {formatKES(totals.discount)}
                </p>
                <p>
                  <strong>VAT (16%):</strong> {formatKES(totals.vat)}
                </p>
                <p className="text-lg font-bold text-[#B57C36]">
                  Nett: {formatKES(totals.nett)}
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={handleSaveSale}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Post Sale
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster
        reverseOrder={false}
        position="top-center"
        containerStyle={{
          marginTop: "-10px",
        }}
        toastOptions={{
          style: {
            background: "darkred",
            color: "white",
            fontWeight: "bold",
          },
        }}
      />
    </section>
  );
};

export default PosSaleDashboard;
