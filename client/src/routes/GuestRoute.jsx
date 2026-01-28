import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function GuestRoute() {
  const userData = useSelector((state) => state.user?.user);

  // If user is logged in (has user data with _id), redirect to home
  if (userData?._id) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
