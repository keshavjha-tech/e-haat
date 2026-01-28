import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ roles }) {
  const userData = useSelector((state) => state.user?.user);

  if (!userData || !userData._id) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userData.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
