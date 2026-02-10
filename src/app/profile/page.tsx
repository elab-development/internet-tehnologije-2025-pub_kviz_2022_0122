"use client";

import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";
import InfoCard from "@/components/InfoCard";

export default function ProfilePage() {
  const { logout, status, user, refresh } = useAuth();

  if (status === "loading") {
    return (
      <div className="h-screen text-white flex items-center justify-center">
        Učitavanje...
      </div>
    );
  }

  if (status === "unauthenticated" || !user) {
    refresh();
    return;
  }

  return (
    <div className="w-full h-screen flex space-x-10 items-center justify-center">
      <InfoCard
        title={user?.name || "Korisnik"}
        fields={[{ label: "Email", value: user?.email }]}
        variant="user-profile"
        action={<Button onClick={logout} label="Odjavi se"></Button>}
      />
    </div>
  );
}
