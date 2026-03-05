"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { useAuth } from "@/components/AuthProvider";
import type { TeamPlacement } from "@/constants/types";

interface UpcomingEventSectionProps {
  eventId: string;
  teams: TeamPlacement[];
  onTeamsUpdated: (teams: TeamPlacement[]) => void;
}

export default function UpcomingEventSection({
  eventId,
  teams,
  onTeamsUpdated,
}: UpcomingEventSectionProps) {
  const { user } = useAuth();
  const [isTeamRegistered, setIsTeamRegistered] = useState(
    teams.some((t) => t.teamId === user?.teamId),
  );
  const [registering, setRegistering] = useState(false);
  const [unregistering, setUnregistering] = useState(false);

  const handleRegisterTeam = async () => {
    if (!user?.teamId) {
      alert("Morate biti deo tima da biste se prijavio/la na događaj");
      return;
    }

    try {
      setRegistering(true);
      const res = await fetch(`/api/events/${eventId}/registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: parseInt(eventId),
          teamId: user.teamId,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Greška pri prijavljivanju");
      }

      setIsTeamRegistered(true);
      const teamsRes = await fetch(`/api/events/${eventId}`, {
        credentials: "include",
      });
      const teamsData = await teamsRes.json();
      onTeamsUpdated(teamsData.teams || []);
      alert("Tim je uspešno prijavljen!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregisterTeam = async () => {
    if (!user?.teamId) {
      alert("Greška: Tim nije pronađen");
      return;
    }

    const confirmUnregister = confirm(
      "Da li ste sigurni da želite da odjavu tim sa ovog događaja?",
    );
    if (!confirmUnregister) return;

    try {
      setUnregistering(true);
      const res = await fetch(`/api/events/${eventId}/registration`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: parseInt(eventId),
          teamId: user.teamId,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Greška pri odjavi tima");
      }

      setIsTeamRegistered(false);
      const teamsRes = await fetch(`/api/events/${eventId}`, {
        credentials: "include",
      });
      const teamsData = await teamsRes.json();
      onTeamsUpdated(teamsData.teams || []);
      alert("Tim je uspešno odjavio sa događaja!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUnregistering(false);
    }
  };

  const userIsCaptain = user?.captain;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Prijavljeni timovi</h2>
        {userIsCaptain && !isTeamRegistered && (
          <Button
            label={registering ? "Prijavljivanje..." : "Prijavi tim"}
            onClick={handleRegisterTeam}
            disabled={registering}
          />
        )}
        {userIsCaptain && isTeamRegistered && (
          <Button
            label={unregistering ? "Odjavljivanje..." : "Odjavi tim"}
            onClick={handleUnregisterTeam}
            disabled={unregistering}
            delete
          />
        )}
      </div>

      {isTeamRegistered && userIsCaptain && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
          <p className="text-green-300 font-semibold">
            ✓ Vaš tim je prijavljen na ovaj događaj
          </p>
        </div>
      )}

      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div
              key={team.teamId}
              className="bg-white/10 border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-all"
            >
              <p className="text-lg font-semibold text-white mb-2">
                {team.teamName}
              </p>
              <p className="text-white/60 text-sm">
                Prijavljeno:{" "}
                {team.registrationDate
                  ? new Date(team.registrationDate).toLocaleDateString("sr-RS")
                  : "-"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/10 border border-white/20 rounded-lg p-8 text-center">
          <p className="text-white/60 text-lg">Još nema prijavljenih timova</p>
        </div>
      )}
    </div>
  );
}
