import React from "react";
import useAuthStore from "./store/useAuthStore.js";
import { Navigate } from "react-router-dom";

const AuthLayout = ({ children, requiresAuth }) => {
  const { user } = useAuthStore();

  if (!user && requiresAuth) {
    return <Navigate to={"/login"} />;
  }

  if (user && !requiresAuth) {
    return <Navigate to={"/"} />;
  }

  return <>{children}</>; // ✅ Correctly returns children
};

export default AuthLayout;
