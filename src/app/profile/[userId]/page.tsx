"use client";

import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";
import { use, useEffect, useState } from "react";
import { User } from "@/constants/types";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const [userData, setUserData] = useState<User | null>(null);
  const { logout, status, user } = useAuth();
  const { userId } = use(params);

  useEffect(() => {
    if (status === "unauthenticated" || !user) {
      return;
    }
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users?id=${userId}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setUserData(data);
        }
      } catch (err) {
        console.error("Greška pri dohvatanju korisnika:", err);
      }
    };

    fetchUserData();
  }, [userId, status]);
  if (status === "loading") {
    return (
      <div className="h-screen text-white flex items-center justify-center">
        Učitavanje...
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex space-x-10 items-center justify-center">
      <div className="w-1/3">
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">
            {userData?.name}
          </h2>
          <p className="text-gray-300 mb-6">{userData?.email}</p>
          <p className="text-gray-300 mb-6">Uloga: {userData?.role}</p>
          {userData?.id === user?.id && (
            <Button onClick={logout} label="Odjavi se"></Button>
          )}
        </div>
      </div>
    </div>
  );
}
