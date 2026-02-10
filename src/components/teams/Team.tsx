"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import type { TeamResponse } from "@/constants/types";
import TeamMembers from "./TeamMembers";
import TeamAchievements from "./TeamAchievements";
import AllTeams from "./AllTeams";
import MyTeam from "./MyTeam";

export const Team: React.FC = () => {
  const { user, status, refresh } = useAuth();
  const [teamData, setTeamData] = useState<TeamResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !user) {
      refresh();
      return;
    }
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`/api/team?id=${user?.id}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setTeamData(data);
        }
      } catch (err) {
        console.error("Greška pri dohvatanju tima:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [user?.id, status]);

  if (status === "loading" || (loading && status === "authenticated")) {
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
        <MyTeam teamData={teamData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TeamMembers teamData={teamData} />
          <TeamAchievements teamData={teamData} />
          <AllTeams teamData={teamData} />
        </div>
      </div>
    </div>
  );
};