"use client";

import Button from "@/components/Button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import type { TeamResponse } from "@/constants/types";

export const TeamSection: React.FC = () => {
  const [teamData, setTeamData] = useState<TeamResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, status, refresh } = useAuth();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !user) {
      refresh();
      return;
    }
    const fetchTeamData = async () => {
      try {
        if (!user.teamId) {
          setTeamData(null);
          return;
        }
        const response = await fetch(`/api/team?id=${user?.teamId}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setTeamData(data);
        } else {
          setError("Nije moguće dohvatiti podatke o timu.");
        }
      } catch (err) {
        console.error("Greška pri dohvatanju tima:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [user?.id, status]);

  return (
    <div className="border shadow-xl flex flex-col items-center justify-center shadow-white/20 border-pub-orange bg-white/10 p-6 mt-8 w-full rounded-xl">
      <h2 className="mb-4 xl:text-4xl text-2xl font-semibold">
        Želiš da učestvuješ u kvizu?
      </h2>

      {teamData ? (
        <div className="flex items-center justify-between">
          <div className="px-4">
            <p className="text-sm text-neutral-500">
              Pogledaj detalje o svom timu i prati kako napredujete u kvizovima.
            </p>
            <p className="text-xl font-medium">Vaš tim: {teamData?.name}</p>
          </div>

          <Button
            onClick={() => {
              router.push(`/team/${user?.teamId || ""}`);
            }}
            label="Moj tim"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between">
          <p className="text-white m-4">
            Još nisi deo nijednog tima. Pridruži se sada i počni da učestvuješ u
            kvizovima sa prijateljima!
          </p>
          <Button
            onClick={() => router.push("/team")}
            label="Pridruži se timu"
          />
        </div>
      )}
    </div>
  );
};
