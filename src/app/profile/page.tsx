"use client";

import { useAuth } from "@/components/AuthProvider";

export default function LogoutButton() {
  const { logout, status, user } = useAuth();

  if (status !== "authenticated") return null;

  console.log("User in LogoutButton", user);

  return (
    <button
      onClick={logout}
      className="px-4 py-2 bg-red-500 text-white rounded size-100"
    >
      {user?.name} - {user?.email} - Logout
    </button>
  );
}
