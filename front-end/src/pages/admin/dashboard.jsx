// import React, { useEffect, useMemo, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import api from "../../utils/api";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import dayjs from "dayjs";
// import weekOfYear from "dayjs/plugin/weekOfYear";

// dayjs.extend(weekOfYear);

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const TIME_FILTERS = {
//   today: "Today",
//   week: "This Week",
//   month: "This Month",
//   year: "This Year",
//   all: "All Time",
// };

// const Dashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [sales, setSales] = useState([]);

//   const [chartMode, setChartMode] = useState("branch"); // branch | user
//   const [timeFilter, setTimeFilter] = useState("month");

//   /* -------------------- FETCH -------------------- */
//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   const loadDashboard = async () => {
//     try {
//       const [usersRes, salesRes, branchesRes] = await Promise.all([
//         api.get("/users/"),
//         api.get("/sales/"),
//         api.get("/branches/"),
//       ]);

//       setUsers(usersRes.data || []);
//       setSales(salesRes.data || []);
//       setBranches(branchesRes.data || []);
//     } catch (err) {
//       console.error("Dashboard Load Error:", err);
//     }
//   };

//   /* -------------------- TIME FILTER -------------------- */
//   const filteredSales = useMemo(() => {
//     const now = dayjs();

//     return sales.filter((sale) => {
//       const saleDate = dayjs(sale.created_at);

//       switch (timeFilter) {
//         case "today":
//           return saleDate.isSame(now, "day");
//         case "week":
//           return saleDate.week() === now.week();
//         case "month":
//           return saleDate.isSame(now, "month");
//         case "year":
//           return saleDate.isSame(now, "year");
//         default:
//           return true;
//       }
//     });
//   }, [sales, timeFilter]);

//   /* -------------------- STATS -------------------- */
//   const totalSales = filteredSales.reduce(
//     (sum, s) => sum + Number(s.total_amount || 0),
//     0
//   );

//   /* -------------------- SALES BY BRANCH -------------------- */
//   const branchSales = useMemo(() => {
//     const map = {};
//     filteredSales.forEach((sale) => {
//       const branch = sale.branch?.name || "Unknown";
//       map[branch] = (map[branch] || 0) + Number(sale.total_amount || 0);
//     });

//     return Object.entries(map).map(([name, total]) => ({
//       name,
//       total,
//     }));
//   }, [filteredSales]);

//   /* -------------------- SALES BY CASHIER -------------------- */
//   const cashierSales = useMemo(() => {
//     const map = {};
//     filteredSales.forEach((sale) => {
//       const user = sale.posted_by?.username || "Unknown";
//       map[user] = (map[user] || 0) + Number(sale.total_amount || 0);
//     });

//     return Object.entries(map)
//       .map(([username, total]) => ({ username, total }))
//       .sort((a, b) => b.total - a.total);
//   }, [filteredSales]);

//   /* -------------------- CHART -------------------- */
//   const chartLabels =
//     chartMode === "branch"
//       ? branchSales.map((b) => b.name)
//       : cashierSales.map((u) => u.username);

//   const chartValues =
//     chartMode === "branch"
//       ? branchSales.map((b) => b.total)
//       : cashierSales.map((u) => u.total);

//   const chartData = {
//     labels: chartLabels,
//     datasets: [
//       {
//         label:
//           chartMode === "branch"
//             ? "Sales per Branch"
//             : "Sales per Cashier",
//         data: chartValues,
//         backgroundColor: "#B57C36",
//         borderRadius: 8,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         callbacks: {
//           label: (ctx) =>
//             `KES ${ctx.raw.toLocaleString()}`,
//         },
//       },
//     },
//     scales: {
//       y: {
//         ticks: {
//           callback: (value) => `KES ${value.toLocaleString()}`,
//         },
//       },
//     },
//   };

//   /* -------------------- UI -------------------- */
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#fff7f0] to-[#f0e6db] p-6 flex justify-center">
//       <div className="w-full max-w-7xl bg-white/90 rounded-3xl shadow-2xl p-8">

//         <h1 className="text-4xl font-bold text-[#B57C36] text-center mb-10">
//           Admin Analytics Dashboard
//         </h1>

//         {/* STATS */}
//         <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
//           <Stat title="Users" value={users.length} />
//           <Stat title="Branches" value={branches.length} />
//           <Stat title="Sales Count" value={filteredSales.length} />
//           <Stat title="Total Sales (KES)" value={totalSales.toLocaleString()} />
//         </div>

//         {/* FILTERS */}
//         <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
//           <div className="flex gap-2">
//             {Object.entries(TIME_FILTERS).map(([key, label]) => (
//               <ToggleButton
//                 key={key}
//                 active={timeFilter === key}
//                 onClick={() => setTimeFilter(key)}
//                 label={label}
//               />
//             ))}
//           </div>

//           <div className="flex gap-2">
//             <ToggleButton
//               active={chartMode === "branch"}
//               onClick={() => setChartMode("branch")}
//               label="Branch View"
//             />
//             <ToggleButton
//               active={chartMode === "user"}
//               onClick={() => setChartMode("user")}
//               label="Cashier View"
//             />
//           </div>
//         </div>

//         {/* CHART */}
//         <div className="bg-white border border-[#B57C36]/20 rounded-xl p-6 shadow-lg">
//           <Bar data={chartData} options={chartOptions} />
//         </div>
//       </div>
//     </div>
//   );
// };

// /* -------------------- COMPONENTS -------------------- */

// const ToggleButton = ({ active, onClick, label }) => (
//   <button
//     onClick={onClick}
//     className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//       active
//         ? "bg-[#B57C36] text-white"
//         : "bg-white border border-[#B57C36] text-[#B57C36]"
//     }`}
//   >
//     {label}
//   </button>
// );

// const Stat = ({ title, value }) => (
//   <div className="bg-white border border-[#B57C36]/20 rounded-xl p-6 text-center shadow hover:shadow-xl transition">
//     <h2 className="text-[#B57C36] font-semibold text-lg mb-1">{title}</h2>
//     <p className="text-3xl font-bold">{value}</p>
//   </div>
// );

// export default Dashboard;

import React, { useEffect, useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import api from "../../utils/api";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

dayjs.extend(weekOfYear);

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

const TIME_FILTERS = { today: "Today", week: "This Week", month: "This Month", year: "This Year" };

const SingleBranchDashboard = () => {
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
  const [timeFilter, setTimeFilter] = useState("month");

  useEffect(() => {
    Promise.all([api.get("/sales/"), api.get("/users/")])
      .then(([salesRes, usersRes]) => {
        setSales(salesRes.data || []);
        setUsers(usersRes.data || []);
      })
      .catch(console.error);
  }, []);

  const filteredSales = useMemo(() => {
    const now = dayjs();
    return sales.filter(s => {
      const d = dayjs(s.created_at);
      if (timeFilter === "today") return d.isSame(now, "day");
      if (timeFilter === "week") return d.isSame(now, "week");
      if (timeFilter === "month") return d.isSame(now, "month");
      if (timeFilter === "year") return d.isSame(now, "year");
      return true;
    });
  }, [sales, timeFilter]);

  const totalRevenue = filteredSales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
  const avgSale = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

  const salesByCashier = useMemo(() => {
    const map = {};
    filteredSales.forEach(s => {
      const user = s.posted_by || "Unknown"; // <-- USE posted_by directly
      map[user] = (map[user] || 0) + Number(s.total_amount || 0);
    });
    return Object.entries(map).map(([username, total]) => ({ username, total })).sort((a,b) => b.total - a.total);
  }, [filteredSales]);

  const getTopCashier = (salesList) => {
    const map = {};
    salesList.forEach(s => {
      const user = s.posted_by || "Unknown";
      map[user] = (map[user] || 0) + Number(s.total_amount || 0);
    });
    return Object.entries(map)
      .map(([user, total]) => ({ user, total }))
      .sort((a, b) => b.total - a.total)[0];
  };

  const topWeek = getTopCashier(sales.filter(s => dayjs(s.created_at).isSame(dayjs(), "week")));
  const topMonth = getTopCashier(sales.filter(s => dayjs(s.created_at).isSame(dayjs(), "month")));

  const dailyTrend = useMemo(() => {
    const map = {};
    filteredSales.forEach(s => {
      const date = dayjs(s.created_at).format("DD MMM");
      map[date] = (map[date] || 0) + Number(s.total_amount || 0);
    });
    return map;
  }, [filteredSales]);

  const barData = {
    labels: salesByCashier.map(c => c.username),
    datasets: [{ label: "Cashier Sales", data: salesByCashier.map(c => c.total), backgroundColor: "#B57C36", borderRadius: 6 }],
  };

  const lineData = {
    labels: Object.keys(dailyTrend),
    datasets: [{ label: "Daily Revenue", data: Object.values(dailyTrend), borderColor: "#B57C36", backgroundColor: "#B57C36", tension: 0.4 }],
  };

  return (
    <div className="min-h-screen bg-[#f6f2ee] p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#B57C36]">Admin Dashboard</h1>
          <div className="flex gap-2">
            {Object.entries(TIME_FILTERS).map(([k,v]) => (
              <button key={k} onClick={() => setTimeFilter(k)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${timeFilter===k?"bg-[#B57C36] text-white":"bg-white border text-[#B57C36]"}`}>
                {v}
              </button>
            ))}
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <KPI title="Revenue" value={`KES ${totalRevenue.toLocaleString()}`} />
          <KPI title="Sales" value={filteredSales.length} />
          <KPI title="Active Cashiers" value={users.length} />
          <KPI title="Avg Sale" value={`KES ${avgSale.toFixed(0)}`} />
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Highlight title="Top Saler This Week" data={topWeek} />
          <Highlight title="Top Saler This Month" data={topMonth} />
        </section>

        <Card title="Revenue Trend"><Line data={lineData} /></Card>
        <Card title="Cashier Leaderboard"><Bar data={barData} /></Card>
      </div>
    </div>
  );
};

const KPI = ({ title, value }) => (
  <div className="bg-white rounded-xl p-6 shadow text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold text-[#B57C36] mt-1">{value}</p>
  </div>
);

const Highlight = ({ title, data }) => (
  <div className="bg-white rounded-xl p-6 shadow text-center">
    <h3 className="font-semibold text-lg mb-2 text-[#B57C36]">{title}</h3>
    {data ? (
      <>
        <p className="text-2xl font-bold">{data.user}</p>
        <p className="text-sm text-gray-500">KES {data.total.toLocaleString()}</p>
      </>
    ) : (<p className="text-gray-400">No sales yet</p>)}
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="font-semibold text-lg mb-4 text-[#B57C36]">{title}</h3>
    {children}
  </div>
);

export default SingleBranchDashboard;
