import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../Navbar";

function LoginLanding() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar />
      <div className="flex justify-center items-center h-screen w-full p-4">
        <div className="max-w-md w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700">
          <div className="flex flex-col w-full">
            {/* Improved tabs */}
            <div className="flex w-full border-b border-slate-700">
              <Link
                to="/Landing/login"
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-4 text-center text-lg font-medium transition-all duration-300 ${
                  activeTab === "login"
                    ? "text-orange-400 border-b-2 border-orange-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Login
              </Link>
              <Link
                to="/Landing/Signup"
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-4 text-center text-lg font-medium transition-all duration-300 ${
                  activeTab === "signup"
                    ? "text-orange-400 border-b-2 border-orange-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Register
              </Link>
            </div>

            {/* Content area with subtle animation */}
            <div className="p-8 animate-fadeIn">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginLanding;
