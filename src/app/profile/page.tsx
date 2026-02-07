"use client";

import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";

export default function LogoutButton() {
  const { logout, status, user } = useAuth();

  if (status !== "authenticated") return null;

  console.log("User in LogoutButton", user);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-pub-blue">
      {" "}
      <Button onClick={logout} label="Odjavi se"></Button>
    </div>
  );
}
