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

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const AdminLogin = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     setTimeout(() => {
//       if (username === "ADMIN01" && password === "ADMIN@2025") {
//         localStorage.setItem("isAdmin", "true");
//         toast.success("Admin login successful");
//         navigate("/admin/dashboard");
//       } else if (username === "INVENTORY01" && password === "INVENTORY@2025") {
//         localStorage.setItem("isInventory", "true");
//         toast.success("Inventory login successful");
//         navigate("/inventory/dashboard");
//       }else if (username === "SALES01" && password === "SALES@2025") {
//         localStorage.setItem("isSales", "true");
//         toast.success("Sales login successful");
//         navigate("/sales/dashboard");
//       } else {
//         toast.error("Invalid credentials", {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//       }
//       setLoading(false);
//     }, 2000);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
//       <div className="backdrop-blur-md bg-white/30 border border-orange-200 shadow-xl rounded-2xl w-full max-w-md p-8">
//         <h1 className="text-2xl font-bold text-[#B57C36] mb-6 text-center">
//           System Login
//         </h1>
//         <form className="space-y-5" onSubmit={handleLogin}>
//           <input
//             type="text"
//             placeholder="Username"
//             className="w-full p-3 rounded-lg bg-white/50 border text-black"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <div className="relative w-full">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               className="w-full p-3 pr-12 rounded-lg bg-white/50 border border-[#B57C36]/40 text-black focus:outline-none focus:ring-2 focus:ring-[#B57C36]"
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
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-2 rounded-lg flex items-center justify-center ${
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

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const AdminLogin = ({ setRole, setLoadingRole, tabId }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   /** Save role + user info scoped to this tab */
//   const saveSession = (role, userInfo, tokens = {}) => {
//     // Role + user
//     localStorage.setItem(`role-${tabId}`, role);
//     localStorage.setItem(`user-${tabId}`, JSON.stringify(userInfo));

//     // Tokens
//     if (tokens.access)
//       localStorage.setItem(`accessToken-${tabId}`, tokens.access);
//     if (tokens.refresh)
//       localStorage.setItem(`refreshToken-${tabId}`, tokens.refresh);
//     if (tokens.branches)
//       localStorage.setItem(
//         `branches-${tabId}`,
//         JSON.stringify(tokens.branches)
//       );

//     // Update React state
//     setRole(role);
//   };

//   /** Navigate to dashboard with splash */
//   const goToDashboard = (role) => {
//     setLoadingRole(true);
//     const path = `/${role}/dashboard`;
//     setTimeout(() => {
//       navigate(path);
//       setLoadingRole(false);
//     }, 1000);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setLoadingRole(true);

//     // Hardcoded admin
//     if (username === "ADMIN01" && password === "ADMIN@2025") {
//       const userInfo = { username: "ADMIN01", role: "admin" };
//       saveSession("admin", userInfo);
//       toast.success("Admin login successful");
//       goToDashboard("admin");
//       setLoading(false);
//       return;
//     }
// try {
//   const response = await fetch("http://localhost:8000/api/login/", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username, password }),
//   });
// // try {
// //   const response = await fetch(`${import.meta.env.VITE_API_URL}/login/`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ username, password }),
// //   });

//       const data = await response.json();

//       if (response.ok) {
//         const userInfo = {
//           username: data.user?.username || username,
//           email: data.user?.email || "",
//           role: data.role,
//         };

//         // Save everything scoped to tab
//         saveSession(data.role, userInfo, {
//           access: data.access,
//           refresh: data.refresh,
//           branches: data.branches || [],
//         });

//         if (["admin", "inventory", "sales", "cashier"].includes(data.role)) {
//           toast.success("Login successful");
//           goToDashboard(data.role);
//         } else {
//           toast.error("Unknown role. Contact support.");
//           setLoadingRole(false);
//         }
//       } else {
//         toast.error(data.error || "Invalid credentials");
//         setLoadingRole(false);
//       }
//     } catch (err) {
//       toast.error("Server error. Please try again.");
//       setLoadingRole(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
//       <div className="backdrop-blur-md bg-white/30 border border-orange-200 shadow-xl rounded-2xl w-full max-w-md p-8">
//         <h1 className="text-2xl font-bold text-[#B57C36] mb-6 text-center">
//           System Login
//         </h1>
//         <form className="space-y-5" onSubmit={handleLogin}>
//           <input
//             type="text"
//             placeholder="Username"
//             className="w-full p-3 rounded-lg bg-white/50 border text-black"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <div className="relative w-full">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               className="w-full p-3 pr-12 rounded-lg bg-white/50 border border-[#B57C36]/40 text-black focus:outline-none focus:ring-2 focus:ring-[#B57C36]"
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
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-2 rounded-lg flex items-center justify-center ${
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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = ({ setRole, setLoadingRole, tabId }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Change password fields
  const [cpUsername, setCpUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Branch selection
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  const navigate = useNavigate();

  const saveSession = (role, userInfo, tokens = {}) => {
    localStorage.setItem(`role-${tabId}`, role);
    localStorage.setItem(`user-${tabId}`, JSON.stringify(userInfo));
    if (tokens.access) localStorage.setItem(`accessToken-${tabId}`, tokens.access);
    if (tokens.refresh) localStorage.setItem(`refreshToken-${tabId}`, tokens.refresh);
    if (tokens.branches) localStorage.setItem(`branches-${tabId}`, JSON.stringify(tokens.branches));
    setRole(role);
  };

  const goToDashboard = (role) => {
    setLoadingRole(true);
    setTimeout(() => {
      navigate(`/${role}/dashboard`);
      setLoadingRole(false);
    }, 700);
  };

  /** HANDLE LOGIN */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingRole(true);

    // try {
    //   const response = await fetch("http://localhost:8000/api/login/", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ username, password }),
    //   });
     try {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

      const data = await response.json();

      if (response.ok) {
        const userInfo = {
          username: data.username || username,
          email: data.user?.email || "",
          role: data.role,
        };

        saveSession(data.role, userInfo, {
          access: data.access,
          refresh: data.refresh,
          branches: data.branches || [],
        });

        setBranches(data.branches || []);
        setLoading(false);
        setLoadingRole(false);

        if (data.role !== "admin" && (data.branches?.length || 0) > 0) {
          setShowBranchModal(true);
          return;
        }

        if (data.role?.toLowerCase() === "admin") {
          toast.success("Admin login successful");
          goToDashboard("admin");
          return;
        }

        if (["inventory", "sales", "cashier"].includes(data.role)) {
          goToDashboard(data.role);
          return;
        }

        toast.error("Unknown role.");
      } else {
        toast.error(data.error || "Invalid credentials");
        setLoadingRole(false);
      }
    } catch (err) {
      toast.error("Server error. Try again.");
      setLoadingRole(false);
    } finally {
      setLoading(false);
    }
  };

  /** CONFIRM BRANCH SELECTION */
  const handleConfirmBranch = () => {
    if (!selectedBranch) {
      toast.error("Select your branch first");
      return;
    }

    localStorage.setItem(`selectedBranch-${tabId}`, selectedBranch);
    toast.success("Branch selected!");
    setShowBranchModal(false);

    const role = localStorage.getItem(`role-${tabId}`);
    goToDashboard(role);
  };

  /** CHANGE PASSWORD */
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/first-login-change-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cpUsername,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Password updated");
        setShowChangePassword(false);
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch {
      toast.error("Server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="backdrop-blur-md bg-white/30 border border-orange-200 shadow-xl rounded-2xl w-full max-w-md p-8">

        {/** LOGIN FORM */}
        {!showChangePassword && !showBranchModal && (
          <>
            <h1 className="text-2xl font-bold text-[#B57C36] mb-6 text-center">System Login</h1>

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
                  className="w-full p-3 pr-12 rounded-lg bg-white/50 border text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B57C36]"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-2 rounded-lg"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p
              onClick={() => setShowChangePassword(true)}
              className="mt-4 text-center text-[#B57C36] cursor-pointer hover:underline"
            >
              Change Your Password here
            </p>
          </>
        )}

        {/** CHANGE PASSWORD FORM */}
        {showChangePassword && (
          <>
            <h1 className="text-2xl font-bold text-[#B57C36] mb-6 text-center">Change Password</h1>
            <form className="space-y-5" onSubmit={handleChangePassword}>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 rounded-lg bg-white/50 border text-black"
                value={cpUsername}
                onChange={(e) => setCpUsername(e.target.value)}
              />

              <div className="relative w-full">
                <input
                  type={showOldPass ? "text" : "password"}
                  placeholder="Old Password"
                  className="w-full p-3 pr-12 rounded-lg bg-white/50 border text-black"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B57C36]"
                >
                  {showOldPass ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>

              <div className="relative w-full">
                <input
                  type={showNewPass ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full p-3 pr-12 rounded-lg bg-white/50 border text-black"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B57C36]"
                >
                  {showNewPass ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>

              <div className="relative w-full">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className="w-full p-3 pr-12 rounded-lg bg-white/50 border text-black"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B57C36]"
                >
                  {showConfirmPass ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-2 rounded-lg"
              >
                {loading ? "Updating..." : "Change Password"}
              </button>
            </form>

            <p
              onClick={() => setShowChangePassword(false)}
              className="mt-4 text-center text-[#B57C36] cursor-pointer hover:underline"
            >
              Back to Login
            </p>
          </>
        )}

        {/** BRANCH SELECTION FORM (styled like login) */}
        {showBranchModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-transparent">
            <div className="backdrop-blur-md bg-white/30 border border-orange-200 shadow-xl rounded-2xl w-full max-w-md p-8">
              <h1 className="text-2xl font-bold text-[#B57C36] mb-6 text-center">
                Select Branch
              </h1>
              <select
                className="w-full p-3 rounded-lg bg-white/50 border text-black mb-5"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">-- Select Branch --</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleConfirmBranch}
                className="w-full bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-2 rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

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
