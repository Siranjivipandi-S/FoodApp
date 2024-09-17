// src/components/Authentication/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useGetToken from "../token";

const ProtectedRoute: React.FC = () => {
  const token = useGetToken();

  return token ? <Outlet /> : <Navigate to="/Landing/login" />;
};

export default ProtectedRoute;
