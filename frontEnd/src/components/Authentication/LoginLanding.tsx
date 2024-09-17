import React from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../Navbar";

function LoginLanding() {
  return (
    <div className="min-h-screen w-full bg-slate-900 ">
      <Navbar />
      <div className="flex justify-center items-center h-screen w-full">
        <div className=" rounded-md shadow-md p-4 w-96">
          <div className="flex flex-col bg-slate-800 h-full w-full rounded-lg items-center justify-center">
            <div className="flex gap-5 items-center mt-5">
              <Link
                to={"/Landing/login"}
                className="text-white text-2xl bg-slate-900 p-2 rounded-lg hover:bg-slate-800 hover:scale-105 transition-all  select-none"
              >
                Login
              </Link>
              <Link
                to={"/Landing/Signup"}
                className="text-white text-2xl bg-slate-900 p-2  rounded-lg hover:bg-slate-800 hover:scale-105 transition-all select-none"
              >
                Register
              </Link>
            </div>
            <div className="flex">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginLanding;
