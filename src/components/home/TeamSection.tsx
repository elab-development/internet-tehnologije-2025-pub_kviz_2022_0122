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
    <div className="border shadow-xl flex flex-col items-center justify-center shadow-white/20 border-pub-orange bg-gradient-to-br from-white/10 to-white/5 p-8 mt-8 w-full rounded-xl">
      <h2 className="mb-6 xl:text-4xl text-2xl font-bold text-center">
        Želiš da učestvuješ u kvizu?
      </h2>

      {teamData ? (
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
          <div className="flex-1 text-center md:text-left">
            <p className="text-white/60 text-sm mb-2">
              Pogledaj detalje o svom timu i prati kako napredujete u kvizovima.
            </p>
            <p className="text-2xl font-semibold">
              <span className="text-white/70">Vaš tim:</span>{" "}
              <span className="text-pub-orange">{teamData?.name}</span>
            </p>
          </div>

          <Button
            onClick={() => {
              router.push(`/team/${user?.teamId || ""}`);
            }}
            label="Moj tim"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-white/80 mb-6 max-w-md">
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
