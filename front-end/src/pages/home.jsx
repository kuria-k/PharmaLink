import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="backdrop-blur-lg bg-white/30 border border-white/40 shadow-xl rounded-2xl p-10 text-center max-w-xl">
        <div className="mb-6">
          <div className="bg-[#B57C36] rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-md">
            <span className="text-white text-2xl font-bold">PL</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-[#B57C36] mb-4 drop-shadow-sm">
          Welcome to PharmaLink
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Your trusted partner in pharmaceutical management and operations.
        </p>
        <button
          onClick={() => navigate("/admin/login")}
          className="bg-[#B57C36] hover:bg-[#9E6B2F] text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-md"
        >
          Proceed to Login
        </button>
        <div className="mt-8 text-xs text-gray-600">
          Powered by{" "}
          <span className="font-semibold text-[#B57C36]">Kevs Solutions</span>
        </div>
      </div>
    </div>
  );
};

export default Home;




