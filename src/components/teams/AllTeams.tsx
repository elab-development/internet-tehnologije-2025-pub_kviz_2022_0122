import Button from "@/components/Button";
import type { TeamResponse } from "@/constants/types";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/AuthProvider";

interface AllTeamsProps {
  teamData: TeamResponse | null;
}

export default function AllTeams({ teamData }: AllTeamsProps) {
  const [allTeams, setAllTeams] = useState<TeamResponse[]>([]);
  const [sentRequests, setSentRequests] = useState<Set<number>>(new Set());
  const [loadingTeamId, setLoadingTeamId] = useState<number | null>(null);

  // NEW: search state
  const [search, setSearch] = useState("");

  const { user, status } = useAuth();

  useEffect(() => {
    const fetchAllTeams = async () => {
      try {
        const response = await fetch("/api/team", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setAllTeams(Array.isArray(data) ? data : []);
        } else {
          setAllTeams([]);
        }
      } catch {
        setAllTeams([]);
      }
    };

    fetchAllTeams();
  }, [user?.id, status]);

  const handleJoinRequest = async (teamId: number) => {
    try {
      setLoadingTeamId(teamId);

      const response = await fetch(`/api/join?id=${teamId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setSentRequests((prev) => new Set(prev).add(teamId));
    } finally {
      setLoadingTeamId(null);
    }
  };

  // NEW: filtered teams
  const filteredTeams = useMemo(() => {
    return allTeams.filter((team) =>
      team.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [allTeams, search]);

  return (
    <div className="lg:col-span-3 border-2 border-pub-orange bg-white shadow-xl rounded-2xl p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-black">Svi timovi</h2>

        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder="Pretraži tim..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            px-4 py-2
            border-2 border-pub-orange/30
            rounded-xl
            outline-none
            focus:border-pub-orange
            focus:ring-2 focus:ring-pub-orange/20
            transition
            w-full md:w-64
          "
        />
      </div>

      {/* TEAMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="
              group border-2 border-pub-orange/30
              rounded-xl p-5
              hover:border-pub-orange hover:shadow-lg
              transition-all
              bg-linear-to-br from-white to-orange-50/30
            "
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-black group-hover:text-pub-orange transition">
                  {team.name}
                </h3>

                <p className="text-sm text-gray-600">
                  {/* možeš kasnije ubaciti team.members.length */}
                </p>
              </div>

              <div className="w-12 h-12 bg-pub-orange/20 rounded-full flex items-center justify-center text-2xl text-pub-gray">
                {team.name.charAt(0)}
              </div>
            </div>

            <div className="flex gap-4 mb-4 text-sm">
              <div>
                <div className="font-semibold text-pub-orange">
                  {team.captain?.name ?? "Nepoznato"}
                </div>
                <div className="text-gray-500">kapiten</div>
              </div>
            </div>

            {!teamData?.id && !sentRequests.has(team.id) && (
              <Button
                onClick={() => handleJoinRequest(team.id)}
                label={
                  loadingTeamId === team.id ? "Slanje..." : "Pošalji zahtev"
                }
                disabled={loadingTeamId === team.id}
              />
            )}

            {!teamData?.id && sentRequests.has(team.id) && (
              <div className="text-green-600 font-semibold text-center py-2">
                ✓ Zahtev poslat
              </div>
            )}

            {teamData?.id && (
              <Button
                onClick={() => console.log("Pogledaj:", team.id)}
                label="Pogledaj tim"
              />
            )}
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredTeams.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          Nema pronađenih timova
        </div>
      )}
    </div>
  );
}
