"use client";

import AllLeagues from "@/components/leagues/AllLeagues";
import { useEffect, useState } from "react";
import { League } from "@/constants/types";

export default function LeaguePage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await fetch("/api/leagues", {
          credentials: "include",
        });
        const data = await response.json();
        setLeagues(data);
      } catch (err) {
        console.error("Greška pri dohvatanju liga:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-pub-orange">
          Učitavanje liga...
        </div>
      </div>
    );
  }

  return <AllLeagues leagues={leagues} />;
}
