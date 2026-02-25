import { useEffect, useState } from "react";
import type { TeamResponse, TeamMember } from "@/constants/types";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";

interface TeamProps {
  teamData: TeamResponse | null;
}

export default function MyTeam({ teamData }: TeamProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [sentRequests, setSentRequests] = useState<Set<number>>(new Set());
  const [loadingTeamId, setLoadingTeamId] = useState<number | null>(null);
  const { user, status } = useAuth();

  const getMonth = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAJ",
      "JUN",
      "JUL",
      "AVG",
      "SEP",
      "OKT",
      "NOV",
      "DEC",
    ];
    return months[d.getMonth()];
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        console.log("Tim ID:", teamData?.id);
        const response = await fetch(`/api/members?id=${teamData?.id}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setTeamMembers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Greška pri dohvatanju clanova:", err);
      }
    };

    const fetchSentRequests = async () => {
      try {
        const response = await fetch("/api/join", {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          const myTeamIds = data
            .filter((req) => req.userId === user?.id)
            .map((req) => req.teamId);

          setSentRequests(new Set(myTeamIds));
        }
      } catch (err) {
        console.error("Greška pri dohvatanju poslatih zahteva:", err);
      }
    };

    fetchSentRequests();
    fetchTeamMembers();
  }, [user?.id, status, sentRequests.size]);

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
  return (
    <div className="relative overflow-hidden bg-transparent shadow-2xl rounded-2xl p-8 md:p-12">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pub-orange opacity-10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-pub-orange opacity-10 rounded-full -ml-24 -mb-24"></div>

      <div className="relative z-10">
        {teamData?.id ? (
          <div className="text-center md:text-left">
            <div className="inline-block px-4 py-1 bg-pub-orange/20 rounded-full mb-4">
              {teamData.id === user?.teamId ? (
                <span className="text-pub-orange font-semibold text-sm">
                  Vaš tim
                </span>
              ) : (
                <span className="text-pub-orange font-semibold text-sm">
                  Tim
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
              {teamData.name}
            </h1>
            <p className="text-lg text-white/80 mb-6">
              Spremni za sledeći kviz!
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-transparent backdrop-blur rounded-xl p-4 border border-pub-gray/50">
                <div className="text-3xl font-bold text-pub-orange">
                  {teamData.captain?.name}
                </div>
                <div className="text-sm text-white/80">Kapiten</div>
              </div>
              <div className="bg-transparent backdrop-blur rounded-xl p-4 border border-pub-gray/50">
                <div className="text-3xl font-bold text-pub-orange">
                  {getMonth(teamData.createdAt)}{" "}
                  {new Date(teamData.createdAt).getFullYear()}
                </div>
                <div className="text-sm text-white/80">Tim kreiran</div>
              </div>
              <div className="bg-transparent backdrop-blur rounded-xl p-4 border border-pub-gray/50">
                <div className="text-3xl font-bold text-pub-orange">
                  {teamMembers.length}
                </div>
                <div className="text-sm text-white/80">Članovi</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Vreme je za tim!
            </h1>
            <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
              Pridruži se timu i takmiči se sa drugima.
            </p>
          </div>
        )}
        {teamData?.id && teamData.id !== user?.teamId && !user?.teamId && (
          <div className="bg-transparent backdrop-blur rounded-xl mt-10 flex items-center justify-center md:justify-start">
            {!sentRequests.has(teamData.id) ? (
              <Button
                onClick={() => handleJoinRequest(teamData.id)}
                label={
                  loadingTeamId === teamData.id ? "Slanje..." : "Pošalji zahtev"
                }
                disabled={loadingTeamId === teamData.id}
              />
            ) : (
              sentRequests.has(teamData.id) && (
                <div className="text-green-500 font-semibold bg-green-500/20 border  border-green-500 self-center md:text-start p-4 w-auto rounded-4xl">
                  ✓ Zahtev za članstvo poslat
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
