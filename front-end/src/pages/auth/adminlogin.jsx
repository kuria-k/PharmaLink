// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AdminLogin = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (username === "ADMIN01" && password === "ADMIN@2025") {
//       localStorage.setItem("isAdmin", "true");
//       toast.success("Login successful");
//       navigate("/admin/dashboard");
//     } else {
//       toast.error("Invalid credentials");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
//       <div className="backdrop-blur-md bg-white/30 border border-orange-200 shadow-xl rounded-2xl w-full max-w-md p-8">
//         <h1 className="text-2xl font-bold text-[#B57C36] mb-6 text-center">Admin Login</h1>
//         <form className="space-y-5" onSubmit={handleLogin}>
//           <input
//             type="text"
//             placeholder="Username"
//             className="w-full p-3 rounded-lg bg-white/50 border text-black"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full p-3 rounded-lg bg-white/50 border text-black"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button
//             type="submit"
//             className="w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-2 rounded-lg"
//           >
//             Login
//           </button>
//         </form>
//         <ToastContainer />
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (username === "ADMIN01" && password === "ADMIN@2025") {
        localStorage.setItem("isAdmin", "true");
        toast.success("Admin login successful");
        navigate("/admin/dashboard");
      } else if (username === "INVENTORY01" && password === "INVENTORY@2025") {
        localStorage.setItem("isInventory", "true");
        toast.success("Inventory login successful");
        navigate("/inventory/dashboard");
      }else if (username === "SALES01" && password === "SALES@2025") {
        localStorage.setItem("isSales", "true");
        toast.success("Sales login successful");
        navigate("/sales/dashboard");
      } else {
        toast.error("Invalid credentials", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="backdrop-blur-md bg-white/30 border border-orange-200 shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-[#B57C36] mb-6 text-center">
          System Login
        </h1>
        <form className="space-y-5" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-white/50 border text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-12 rounded-lg bg-white/50 border border-[#B57C36]/40 text-black focus:outline-none focus:ring-2 focus:ring-[#B57C36]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B57C36] hover:text-[#9E6B2F] focus:outline-none"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-2 rounded-lg flex items-center justify-center ${
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
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminLogin;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import {jwtDecode} from "jwt-decode";
// import { login } from "../../utils/api";  

// const AdminLogin = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Call backend /api/token/ endpoint
//       const { access, refresh } = await login(username, password);

//       // Save tokens
//       localStorage.setItem("token", access);
//       localStorage.setItem("refresh", refresh);

//       // Decode token to check role
//       const decoded = jwtDecode(access);
//       const role = decoded.role || (decoded.is_superuser ? "admin" : "user");

//       toast.success("Login successful", {
//         position: "top-center",
//         autoClose: 2000,
//       });

//       // Redirect based on role
//       if (role === "admin") {
//         navigate("/admin/dashboard");
//       } else if (role === "cashier") {
//         navigate("/cashier/dashboard");
//       } else if (role === "inventory") {
//         navigate("/inventory/dashboard");
//       } else {
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       toast.error("Invalid credentials", {
//         position: "top-center",
//         autoClose: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
//       <div className="backdrop-blur-md bg-white/30 border border-orange-200 shadow-xl rounded-2xl w-full max-w-md p-8">
//         <h1 className="text-2xl font-bold text-[#B57C36] mb-6 text-center">
//           Admin Login
//         </h1>
//         <form className="space-y-5" onSubmit={handleLogin}>
//           {/* Username Input */}
//           <input
//             type="text"
//             placeholder="Username"
//             className="w-full p-3 rounded-lg bg-white/50 border border-[#B57C36]/30 text-black focus:outline-none focus:ring-2 focus:ring-[#B57C36]"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />

//           {/* Password Input */}
//           <div className="relative w-full">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               className="w-full p-3 pr-12 rounded-lg bg-white/50 border border-[#B57C36]/30 text-black focus:outline-none focus:ring-2 focus:ring-[#B57C36]"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B57C36] hover:text-[#9E6B2F] focus:outline-none"
//             >
//               {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
//             </button>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-2 rounded-lg flex items-center justify-center transition ${
//               loading ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//           >
//             {loading ? (
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="animate-spin h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
//                   ></path>
//                 </svg>
//                 <span>Logging in...</span>
//               </div>
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>
//         <ToastContainer />
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;
