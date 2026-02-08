"use client";

import Button from "../Button";
import React, { useEffect, useState } from "react";
type TeamResponse = {
  userId: string | number;
  team: {
    id: string | number;
    name: string;
  };
};

export const TeamSection: React.FC = () => {
  const [teamData, setTeamData] = useState<TeamResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch("/api/team", {
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data?.error || "Failed to fetch team data");
        setTeamData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    console.log(
      "MyTeam component - teamData:",
      teamData,
      "loading:",
      loading,
      "error:",
      error,
    );
    fetchTeamData();
  }, []);

  return (
    <div className="border shadow-xl flex flex-col items-center justify-center shadow-white/20 border-pub-orange bg-white/10 p-6 mt-8 w-full">
      <h2 className="mb-4 xl:text-4xl text-2xl font-semibold">
        Želiš da učestvuješ u kvizu?
      </h2>

      {teamData?.team ? (
        <div className="flex items-center justify-between">
          <div className="px-4">
            <p className="text-sm text-neutral-500">
              Pogledaj detalje o svom timu i prati kako napredujete u kvizovima.
            </p>
            <p className="text-xl font-medium">Vaš tim: {teamData.team.name}</p>
          </div>

          <Button href="/team" label="Moj tim" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between">
          <p className="text-white m-4">
            Još nisi deo nijednog tima. Pridruži se sada i počni da učestvuješ u
            kvizovima sa prijateljima!
          </p>
          <Button href="/team" label="Pridruži se timu" />
        </div>
      )}
    </div>
  );
};