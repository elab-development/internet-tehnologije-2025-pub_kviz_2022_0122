"use client";

import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";
import { MyTeam } from "@/components/teams/MyTeam";

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
      <MyTeam userId={user?.id} />
      <Button onClick={logout} label="Odjavi se"></Button>
    </div>
  );
}