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

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

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
  }, [userId, status, user]);

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
        <div className="bg-slate-800 rounded-lg p-8 shadow-lg flex flex-col items-center">
          
          <div className="w-32 h-32 rounded-full border-4 border-indigo-500 overflow-hidden bg-slate-700 mb-6 shadow-inner">
            <img 
              src={avatarUrl} 
              alt="User Avatar" 
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            {userData?.name || "Korisnik"}
          </h2>
          
          <div className="text-center space-y-1 mb-8">
            <p className="text-gray-400">{userData?.email}</p>
            <span className="inline-block px-3 py-1 bg-indigo-900/50 text-indigo-300 text-xs font-semibold rounded-full uppercase tracking-wider">
              {userData?.role}
            </span>
          </div>

          {userData?.id === user?.id && (
            <Button onClick={logout} label="Odjavi se"></Button>
          )}
        </div>
      </div>
    </div>
  );
}