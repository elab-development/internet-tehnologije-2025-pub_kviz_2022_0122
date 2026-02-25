"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

import AllTeams from "@/components/teams/AllTeams";

export default function NoTeam() {
  const { user, status, refresh } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated" || !user) {
      refresh();
      return;
    }
  }, [user?.teamId, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl font-bold text-pub-orange">
          Učitavanje profila i tima...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 mt-20">
      <div className="container mx-auto max-w-7xl space-y-8">
        <div className="relative overflow-hidden bg-transparent shadow-2xl rounded-2xl p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pub-orange opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pub-orange opacity-10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Vreme je za tim!
              </h1>
              <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
                Pridruži se timu i takmiči se sa drugima.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AllTeams />
        </div>
      </div>
    </div>
  );
}