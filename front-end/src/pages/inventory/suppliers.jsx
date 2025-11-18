import React, { useState, useEffect } from "react";
import axios from "axios";

// Static list of countries
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina",
  "Armenia", "Australia", "Austria", "Bahamas", "Bahrain", "Bangladesh",
  "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
  "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada",
  "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritius", "Mexico",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
  "Myanmar", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tanzania",
  "Thailand", "Togo", "Trinidad and Tobago", "Tunisia", "Turkey", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch suppliers from backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/inventory/suppliers/")
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error("Error fetching suppliers:", err));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new supplier
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/inventory/suppliers/",
        newSupplier
      );
      setSuppliers([...suppliers, res.data]);
      setNewSupplier({
        name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        country: "",
      });
    } catch (err) {
      console.error("Error adding supplier:", err);
      alert("Failed to add supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Filter suppliers by search term
  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass p-6">
        <h1 className="text-3xl font-bold text-[#B57C36]">Suppliers</h1>
        <p className="mt-2 text-gray-700">
          Manage supplier information and contacts.
        </p>
      </div>

      {/* Add Supplier Form */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Add New Supplier</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Supplier Name"
            value={newSupplier.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
          />
          <input
            type="text"
            name="contact_person"
            placeholder="Contact Person"
            value={newSupplier.contact_person}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={newSupplier.phone}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={newSupplier.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newSupplier.address}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
          />

          {/* Country Dropdown */}
          <select
            name="country"
            value={newSupplier.country}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Saving..." : "Save Supplier"}
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="glass p-4">
        <input
          type="text"
          placeholder="Search suppliers by name, contact, phone, email, or country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/40"
        />
      </div>

      {/* Suppliers Table */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-[#B57C36] mb-4">Suppliers List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#B57C36]/20 text-[#B57C36]">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Contact Person</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Country</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.contact_person}</td>
                <td className="p-3">{s.phone}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.address}</td>
                <td className="p-3">{s.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Suppliers;

