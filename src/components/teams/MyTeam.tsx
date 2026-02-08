"use client";

import React, { useEffect, useState } from "react";

type TeamResponse = {
  userId: string | number;
  team: {
    id: string | number;
    name: string;
  };
};

type MyTeamProps = {
  userId?: string | number;
};

export const MyTeam: React.FC<MyTeamProps> = ({ userId }) => {
  const [teamData, setTeamData] = useState<TeamResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const url = userId ? `/api/team?id=${encodeURIComponent(String(userId))}` : "/api/team";
        const response = await fetch(url, {
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Failed to fetch team data");
        setTeamData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
console.log("MyTeam component - teamData:", teamData, "loading:", loading, "error:", error);
    fetchTeamData();
  }, [userId]);

  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!teamData) return <div>No team data</div>;

  return (
    <div className="my-team h-screen mt-50">
      <h2>My Team</h2>
      <div className="team-card">
        <h3>{teamData.team.name}</h3>
        <p>Team ID: {teamData.team.id}</p>
        <p>User ID: {teamData.userId}</p>
      </div>
    </div>
  );
};