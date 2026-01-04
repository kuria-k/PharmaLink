// src/pages/sales/Reports.jsx
import React, { useEffect, useState } from "react";
import { getSales, getCustomers } from "../../utils/api";
import { FaUsers, FaShoppingCart, FaCrown } from "react-icons/fa";
import { FiTrendingUp } from 'react-icons/fi';

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [salesLeaderboard, setSalesLeaderboard] = useState([]);
  const itemsPerPage = 10;

  //  Pagination logic
  const totalPages = Math.ceil(sales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSales = sales.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, customersRes] = await Promise.all([
          getSales(),
          getCustomers(),
        ]);
        setSales(salesRes.data || []);
        setCustomers(customersRes.data || []);
      } catch (error) {
        console.error("Error fetching reports data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- KPI Calculations ---
  const totalUsers = customers.length;
  const totalSales = sales.length;

  const customerTotals = {};
  sales.forEach((sale) => {
    const clientName = sale.customer_name || "Unknown";
    const amount = Number(sale.total_amount) || 0;
    customerTotals[clientName] = (customerTotals[clientName] || 0) + amount;
  });

  const sortedClients = Object.entries(customerTotals).sort((a, b) => b[1] - a[1]);
  const topClient = sortedClients[0]?.[0] || "N/A";
  const topClientSales = sortedClients[0]?.[1] || 0;

  const recentSales = [...sales]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Calculate sales leaderboard from current sales
 useEffect(() => {
    if (sales.length > 0) {
      // Group sales by posted_by and calculate totals
      const salesByPerson = sales.reduce((acc, sale) => {
        const seller = sale.posted_by || "Unknown";
        if (!acc[seller]) {
          acc[seller] = {
            name: seller,
            total_sales: 0,
            transactions: 0
          };
        }
        acc[seller].total_sales += Number(sale.total_amount) || 0;
        acc[seller].transactions += 1;
        return acc;
      }, {});

//       // Convert to array and sort by total_sales
      const leaderboard = Object.values(salesByPerson)
        .sort((a, b) => b.total_sales - a.total_sales)
        .slice(0, 10); // Top 10

      setSalesLeaderboard(leaderboard);
    }
  }, [sales]);


  return (
    <div className="space-y-20 mt-10">
      <h2 className="text-4xl font-extrabold text-[#B57C36] mb-6 text-center">
        Sales Reports Dashboard
      </h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading reports...</p>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 text-center rounded-xl shadow-lg hover:scale-105 transition">
              <FaUsers className="text-3xl text-[#B57C36] mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-[#B57C36]">Total Users</h2>
              <p className="text-4xl font-bold">{totalUsers}</p>
            </div>
            <div className="glass p-6 text-center rounded-xl shadow-lg hover:scale-105 transition">
              <FaShoppingCart className="text-3xl text-[#B57C36] mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-[#B57C36]">Total Sales</h2>
              <p className="text-4xl font-bold">{totalSales}</p>
            </div>
            <div className="glass p-6 text-center rounded-xl shadow-lg hover:scale-105 transition">
              <FaCrown className="text-3xl text-[#B57C36] mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-[#B57C36]">Top Client</h2>
              <p className="text-2xl font-bold">{topClient}</p>
              <p className="text-sm text-gray-600">Sales: KSH {topClientSales.toFixed(2)}</p>
            </div>
          </div>

          {/* Top Clients Leaderboard */}
          <div className="glass p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-[#B57C36] mb-4"> Top Clients</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#B57C36] text-white">
                  <th className="p-3 text-left">Rank</th>
                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-left">Total Sales (KSH)</th>
                </tr>
              </thead>
              <tbody>
                {sortedClients.slice(0, 5).map(([client, amount], idx) => (
                  <tr
                    key={idx}
                    className={`border-b hover:bg-gray-50 transition ${
                      idx % 2 === 0 ? "bg-gray-100/50" : ""
                    }`}
                  >
                    <td className="p-3 font-bold">#{idx + 1}</td>
                    <td className="p-3">{client}</td>
                    <td className="p-3">{amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Top Clients Leaderboard */}
              <div className="glass p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-[#B57C36] mb-4 flex items-center gap-2">
                  <FaCrown className="text-[#B57C36]" />
                  Top Clients
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#B57C36] text-white">
                        <th className="p-3 text-left rounded-tl-lg">Rank</th>
                        <th className="p-3 text-left">Client</th>
                        <th className="p-3 text-right rounded-tr-lg">Total Sales (KSH)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedClients.slice(0, 5).map(([client, amount], idx) => (
                        <tr
                          key={idx}
                          className={`border-b border-gray-200 hover:bg-[#B57C36]/5 transition-colors ${
                            idx % 2 === 0 ? "bg-white/40" : "bg-white/20"
                          }`}
                        >
                          <td className="p-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md ${
                              idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                              idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                              idx === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                              'bg-gradient-to-br from-[#B57C36] to-[#a56b2f]'
                            }`}>
                              {idx + 1}
                            </div>
                          </td>
                          <td className="p-3 font-medium text-gray-800">{client}</td>
                          <td className="p-3 text-right font-bold text-[#B57C36]">{amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sales Leaderboard */}
              <div className="glass p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-[#B57C36] mb-4 flex items-center gap-2">
                  <FiTrendingUp />
                  Top Sales Representatives
                </h2>
                
                <ul className="divide-y divide-gray-200 text-sm">
                  {salesLeaderboard.map((seller, idx) => (
                    <li
                      key={idx}
                      className="py-3 flex items-center justify-between hover:bg-[#B57C36]/5 transition-colors rounded-md px-2"
                    >
                      {/* Rank & Seller Info */}
                      <div className="flex items-center gap-3">
                        {/* Rank Badge */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${
                          idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                          idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                          idx === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                          'bg-gradient-to-br from-[#B57C36] to-[#a56b2f]'
                        }`}>
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </div>
                        
                        {/* Seller Details */}
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-gray-800">
                            {seller.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {seller.transactions} {seller.transactions === 1 ? 'transaction' : 'transactions'}
                          </span>
                        </div>
                      </div>

                      {/* Total Sales */}
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#B57C36] text-lg">
                          KSH {Number(seller.total_sales).toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>


          {/* Recent Sales Activity */}
      {/* Recent Sales Activity */}
<div className="glass p-6 rounded-xl shadow-lg">
  <h2 className="text-2xl font-bold text-[#B57C36] mb-4 flex items-center gap-2">
    Recent Sales
  </h2>

  <ul className="divide-y divide-gray-200 text-sm">
    {currentSales.map((sale, idx) => (
      <li
        key={idx}
        className="py-3 flex items-center justify-between hover:bg-gray-50 transition rounded-md px-2"
      >
        {/* Customer & Posted By */}
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 bg-[#B57C36] rounded-full"></span>
            {sale.customer_name || "Unknown"}
          </span>
          <span className="text-xs text-gray-500 ml-4">
            Posted by: {sale.posted_by || "N/A"}
          </span>
        </div>

        {/* Amount */}
        <span className="font-semibold text-[#B57C36] bg-[#FFD580]/30 px-3 py-1 rounded-full">
          KSH {Number(sale.total_amount).toFixed(2)}
        </span>

        {/* Date */}
        <span className="text-gray-500 text-xs">{sale.date}</span>
      </li>
    ))}
  </ul>
  


      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i + 1
                ? "bg-[#B57C36] text-white font-bold"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
        </>
      )}
    </div>
  );
};

export default Reports;


// // src/pages/sales/Reports.jsx
// import React, { useEffect, useState } from "react";
// import { getSales, getCustomers } from "../../utils/api";
// import { FaUsers, FaShoppingCart, FaCrown } from "react-icons/fa";
// import { FiTrendingUp } from 'react-icons/fi';

// const Reports = () => {
//   const [sales, setSales] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [salesLeaderboard, setSalesLeaderboard] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   //  Pagination logic
//   const totalPages = Math.ceil(sales.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentSales = sales.slice(startIndex, startIndex + itemsPerPage);

//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [salesRes, customersRes] = await Promise.all([
//           getSales(),
//           getCustomers(),
//         ]);
//         setSales(salesRes.data || []);
//         setCustomers(customersRes.data || []);
//       } catch (error) {
//         console.error("Error fetching reports data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Calculate sales leaderboard from current sales
//   useEffect(() => {
//     if (sales.length > 0) {
//       // Group sales by posted_by and calculate totals
//       const salesByPerson = sales.reduce((acc, sale) => {
//         const seller = sale.posted_by || "Unknown";
//         if (!acc[seller]) {
//           acc[seller] = {
//             name: seller,
//             total_sales: 0,
//             transactions: 0
//           };
//         }
//         acc[seller].total_sales += Number(sale.total_amount) || 0;
//         acc[seller].transactions += 1;
//         return acc;
//       }, {});

//       // Convert to array and sort by total_sales
//       const leaderboard = Object.values(salesByPerson)
//         .sort((a, b) => b.total_sales - a.total_sales)
//         .slice(0, 10); // Top 10

//       setSalesLeaderboard(leaderboard);
//     }
//   }, [sales]);

//   // --- KPI Calculations ---
//   const totalUsers = customers.length;
//   const totalSales = sales.length;
//   const totalRevenue = sales.reduce((sum, sale) => sum + (Number(sale.total_amount) || 0), 0);

//   const customerTotals = {};
//   sales.forEach((sale) => {
//     const clientName = sale.customer_name || "Unknown";
//     const amount = Number(sale.total_amount) || 0;
//     customerTotals[clientName] = (customerTotals[clientName] || 0) + amount;
//   });

//   const sortedClients = Object.entries(customerTotals).sort((a, b) => b[1] - a[1]);
//   const topClient = sortedClients[0]?.[0] || "N/A";
//   const topClientSales = sortedClients[0]?.[1] || 0;

//   const recentSales = [...sales]
//     .sort((a, b) => new Date(b.date) - new Date(a.date))
//     .slice(0, 10);

//   return (
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         <h2 className="text-4xl font-extrabold text-[#B57C36] mb-6 text-center">
//           Sales Reports Dashboard
//         </h2>

//         {loading ? (
//           <div className="flex items-center justify-center min-h-[400px]">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#B57C36] mx-auto mb-4"></div>
//               <p className="text-gray-500 text-lg">Loading reports...</p>
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* KPI Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <div className="glass p-6 text-center rounded-xl shadow-lg hover:scale-105 transition-transform duration-200">
//                 <FaUsers className="text-4xl text-[#B57C36] mx-auto mb-3" />
//                 <h2 className="text-lg font-semibold text-[#B57C36] mb-1">Total Users</h2>
//                 <p className="text-4xl font-bold text-gray-800">{totalUsers}</p>
//               </div>
              
//               <div className="glass p-6 text-center rounded-xl shadow-lg hover:scale-105 transition-transform duration-200">
//                 <FaShoppingCart className="text-4xl text-[#B57C36] mx-auto mb-3" />
//                 <h2 className="text-lg font-semibold text-[#B57C36] mb-1">Total Sales</h2>
//                 <p className="text-4xl font-bold text-gray-800">{totalSales}</p>
//               </div>

//               <div className="glass p-6 text-center rounded-xl shadow-lg hover:scale-105 transition-transform duration-200">
//                 <FiTrendingUp className="text-4xl text-[#B57C36] mx-auto mb-3" />
//                 <h2 className="text-lg font-semibold text-[#B57C36] mb-1">Total Revenue</h2>
//                 <p className="text-3xl font-bold text-gray-800">KSH {totalRevenue.toLocaleString()}</p>
//               </div>
              
//               <div className="glass p-6 text-center rounded-xl shadow-lg hover:scale-105 transition-transform duration-200">
//                 <FaCrown className="text-4xl text-[#B57C36] mx-auto mb-3" />
//                 <h2 className="text-lg font-semibold text-[#B57C36] mb-1">Top Client</h2>
//                 <p className="text-xl font-bold text-gray-800">{topClient}</p>
//                 <p className="text-sm text-gray-600 mt-1">KSH {topClientSales.toLocaleString()}</p>
//               </div>
//             </div>

//             {/* Two Column Layout */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
//               {/* Top Clients Leaderboard */}
//               <div className="glass p-6 rounded-xl shadow-lg">
//                 <h2 className="text-2xl font-bold text-[#B57C36] mb-4 flex items-center gap-2">
//                   <FaCrown className="text-[#B57C36]" />
//                   Top Clients
//                 </h2>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead>
//                       <tr className="bg-[#B57C36] text-white">
//                         <th className="p-3 text-left rounded-tl-lg">Rank</th>
//                         <th className="p-3 text-left">Client</th>
//                         <th className="p-3 text-right rounded-tr-lg">Total Sales (KSH)</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {sortedClients.slice(0, 5).map(([client, amount], idx) => (
//                         <tr
//                           key={idx}
//                           className={`border-b border-gray-200 hover:bg-[#B57C36]/5 transition-colors ${
//                             idx % 2 === 0 ? "bg-white/40" : "bg-white/20"
//                           }`}
//                         >
//                           <td className="p-3">
//                             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md ${
//                               idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
//                               idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
//                               idx === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
//                               'bg-gradient-to-br from-[#B57C36] to-[#a56b2f]'
//                             }`}>
//                               {idx + 1}
//                             </div>
//                           </td>
//                           <td className="p-3 font-medium text-gray-800">{client}</td>
//                           <td className="p-3 text-right font-bold text-[#B57C36]">{amount.toLocaleString()}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Sales Leaderboard */}
//               <div className="glass p-6 rounded-xl shadow-lg">
//                 <h2 className="text-2xl font-bold text-[#B57C36] mb-4 flex items-center gap-2">
//                   <FiTrendingUp />
//                   Top Sales Representatives
//                 </h2>
                
//                 <ul className="divide-y divide-gray-200 text-sm">
//                   {salesLeaderboard.map((seller, idx) => (
//                     <li
//                       key={idx}
//                       className="py-3 flex items-center justify-between hover:bg-[#B57C36]/5 transition-colors rounded-md px-2"
//                     >
//                       {/* Rank & Seller Info */}
//                       <div className="flex items-center gap-3">
//                         {/* Rank Badge */}
//                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${
//                           idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
//                           idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
//                           idx === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
//                           'bg-gradient-to-br from-[#B57C36] to-[#a56b2f]'
//                         }`}>
//                           {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
//                         </div>
                        
//                         {/* Seller Details */}
//                         <div className="flex flex-col gap-1">
//                           <span className="font-semibold text-gray-800">
//                             {seller.name}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             {seller.transactions} {seller.transactions === 1 ? 'transaction' : 'transactions'}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Total Sales */}
//                       <div className="flex items-center gap-3">
//                         <span className="font-bold text-[#B57C36] text-lg">
//                           KSH {Number(seller.total_sales).toLocaleString()}
//                         </span>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//             </div>

//             {/* Recent Sales Activity */}
//             <div className="glass p-6 rounded-xl shadow-lg">
//               <h2 className="text-2xl font-bold text-[#B57C36] mb-4 flex items-center gap-2">
//                 <FaShoppingCart />
//                 Recent Sales Activity
//               </h2>

//               <div className="overflow-x-auto">
//                 <ul className="divide-y divide-gray-200 text-sm">
//                   {recentSales.map((sale, idx) => (
//                     <li
//                       key={idx}
//                       className="py-4 flex items-center justify-between hover:bg-[#B57C36]/5 transition-colors rounded-md px-3"
//                     >
//                       {/* Customer & Posted By */}
//                       <div className="flex flex-col gap-1 flex-1 min-w-0">
//                         <span className="flex items-center gap-2 font-medium text-gray-800">
//                           <span className="w-2 h-2 bg-[#B57C36] rounded-full flex-shrink-0"></span>
//                           <span className="truncate">{sale.customer_name || "Unknown"}</span>
//                         </span>
//                         <span className="text-xs text-gray-500 ml-4">
//                           Posted by: <span className="font-medium">{sale.posted_by || "N/A"}</span>
//                         </span>
//                       </div>

//                       {/* Amount */}
//                       <span className="font-bold text-[#B57C36] bg-[#FFD580]/30 px-4 py-2 rounded-full mx-4 whitespace-nowrap">
//                         KSH {Number(sale.total_amount).toLocaleString()}
//                       </span>

//                       {/* Date */}
//                       <span className="text-gray-500 text-xs whitespace-nowrap">
//                         {new Date(sale.date).toLocaleDateString('en-US', { 
//                           month: 'short', 
//                           day: 'numeric',
//                           year: 'numeric'
//                         })}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Pagination Controls */}
//               <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
//                 <button
//                   onClick={() => goToPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="px-4 py-2 rounded-lg bg-white border-2 border-[#B57C36]/20 text-[#B57C36] hover:bg-[#B57C36] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
//                 >
//                   Previous
//                 </button>

//                 {/* Page numbers */}
//                 <div className="flex gap-1">
//                   {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
                    
//                     return (
//                       <button
//                         key={i}
//                         onClick={() => goToPage(pageNum)}
//                         className={`w-10 h-10 rounded-lg font-medium transition-all ${
//                           currentPage === pageNum
//                             ? "bg-[#B57C36] text-white shadow-lg scale-110"
//                             : "bg-white border-2 border-[#B57C36]/20 text-[#B57C36] hover:bg-[#B57C36]/10"
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <button
//                   onClick={() => goToPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="px-4 py-2 rounded-lg bg-white border-2 border-[#B57C36]/20 text-[#B57C36] hover:bg-[#B57C36] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
//                 >
//                   Next
//                 </button>
//               </div>

//               <div className="text-center mt-4 text-sm text-gray-600">
//                 Page {currentPage} of {totalPages} • Total Sales: {sales.length}
//               </div>
//             </div>

//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Reports;
