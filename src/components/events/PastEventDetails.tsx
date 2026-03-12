"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import type { TeamPoints } from "@/constants/types";
import Button from "../Button";

interface PastEventSectionProps {
  eventId: string;
  teams: TeamPoints[];
  onTeamsUpdated: (teams: TeamPoints[]) => void;
}

export default function PastEventDetails({
  eventId,
  teams,
  onTeamsUpdated,
}: PastEventSectionProps) {
  const { user } = useAuth();
  const [editingResults, setEditingResults] = useState(false);
  const [results, setResults] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState(false);

  function isAdmin() {
    return user?.role === "ADMIN" || user?.role === "ORGANIZER";
  }

  useEffect(() => {
    const resultMap: Record<number, number> = {};
    teams.forEach((t) => {
      if (t.points) {
        resultMap[t.teamId] = t.points;
      }
    });
    setResults(resultMap);
  }, [teams]);

  const handleUpdateResults = async () => {
    if (user?.role !== "ADMIN" && user?.role !== "ORGANIZER") {
      alert("Samo administratori i organizatori mogu ažurirati rezultate");
      return;
    }

    try {
      setSaving(true);
      const updates = Object.entries(results).map(([teamId, points]) => ({
        eventId: parseInt(eventId),
        teamId: parseInt(teamId),
        points,
      }));

      const res = await fetch(`/api/events/${eventId}/results`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ results: updates }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Greška pri ažuriranju rezultata");
      }

      alert("Rezultati su uspešno ažurirani!");
      const teamsRes = await fetch(`/api/events/${eventId}`, {
        credentials: "include",
        method: "GET",
      });
      const teamsData = await teamsRes.json();
      onTeamsUpdated(teamsData.results || []);
      setEditingResults(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveResults = async () => {
    await handleUpdateResults();
  };

  const sortedTeams = [...teams].sort(
    (a, b) => (a.points || 999) - (b.points || 999),
  );

  function getPlacementStyle(place: number) {
    if (place === 1)
      return "bg-yellow-500/20 border-yellow-400 text-yellow-300";
    if (place === 2) return "bg-gray-400/20 border-gray-300 text-gray-200";
    if (place === 3) return "bg-amber-700/20 border-amber-500 text-amber-400";
    return "bg-white/10 border-white/20 text-white";
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Rezultati događaja</h2>
        {isAdmin() && !editingResults && (
          <Button
            label="Uredi rezultate"
            onClick={() => setEditingResults(true)}
          />
        )}
      </div>

      {editingResults && isAdmin() ? (
        <div className="bg-white/10 border border-white/20 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Ažuriranje rezultata
          </h3>
          <div className="space-y-4 mb-6">
            {teams.map((team) => (
              <div
                key={team.teamId}
                className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-lg"
              >
                <label className="text-white font-medium flex-1">
                  {team.teamName}
                </label>
                <input
                  type="number"
                  min="1"
                  max={teams.length}
                  value={results[team.teamId] || ""}
                  onChange={(e) =>
                    setResults({
                      ...results,
                      [team.teamId]: e.target.value
                        ? parseInt(e.target.value)
                        : 0,
                    })
                  }
                  placeholder="Broj bodova"
                  className="bg-white/20 border border-white/30 rounded px-4 py-2 text-white placeholder-white/50 w-24"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <Button
              label={saving ? "Čuvanje..." : "Spremi"}
              onClick={handleSaveResults}
              disabled={saving}
            />
            <Button
              label="Otkaži"
              onClick={() => setEditingResults(false)}
              delete={true}
            />
          </div>
        </div>
      ) : (
        <>
          {teams.length > 0 ? (
            <div className="space-y-4">
              {sortedTeams.map((team, index) => {
                const place = index + 1;
                return (
                  <div
                    key={team.teamId}
                    className="bg-linear-to-r from-white/10 to-white/5 border border-white/20 rounded-lg p-6 hover:from-white/15 hover:to-white/10 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div
                        className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold text-lg ${getPlacementStyle(place)}`}
                      >
                        {place}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-white">
                          {team.teamName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-sm">
                          BROJ BODOVA:
                        </span>
                        <span className="text-2xl font-bold text-pub-orange tabular-nums min-w-10 text-right">
                          {team.points || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/10 border border-white/20 rounded-lg p-8 text-center">
              <p className="text-white/60 text-lg">Nema dostupnih rezultata</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
