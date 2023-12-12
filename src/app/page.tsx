"use client";
import React from "react";
import Landing from "./home/page";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

import { useAuth } from "@/context/authContext/authContext";

export default function Delux() {
  const { user, token } = useAuth();
  return (
    <>
      {(!token || user?.userType !== "admin") && <Landing />}
      {token && user?.userType === "admin" && <AdminDashboard />}
    </>
  );
}
