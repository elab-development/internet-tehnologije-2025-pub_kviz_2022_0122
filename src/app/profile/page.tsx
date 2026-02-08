"use client";

import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";

export default function LogoutButton() {
  const { logout, status, user } = useAuth();

  console.log(user);

  if (status === "loading") {
    return (
      <div className="h-screen text-white flex items-center justify-center">
        Učitavanje...
      </div>
    );
  }

  if (status === "unauthenticated") window.location.href = "/login";

  return (
    <div className="w-full h-screen flex items-center justify-center bg-pub-blue">
      {" "}
      <Button onClick={logout} label="Odjavi se"></Button>
    </div>
  );
}