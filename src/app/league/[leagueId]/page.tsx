"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { SpecificLeague, Season } from "@/constants/types";
import SeasonsComponent from "@/components/leagues/SeasonsComponent";
import SpecificLeagueComponent from "@/components/leagues/SpecificLeague";

export default function LeagueDetailPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = use(params);
  const [league, setLeague] = useState<SpecificLeague | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const response = await fetch(`/api/leagues/${leagueId}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setLeague(data);
        }
      } catch (err) {
        console.error("Greška pri dohvatanju lige:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeague();
  }, [leagueId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-pub-orange">Učitavanje...</div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-black">Liga nije pronađena</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-30">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/league"
          className="inline-flex items-center text-pub-orange font-semibold mb-8 hover:translate-x-2 transition-transform"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Nazad
        </Link>

        <SpecificLeagueComponent league={league} />
        <SeasonsComponent league={league} />
      </div>
    </div>
  );
}
