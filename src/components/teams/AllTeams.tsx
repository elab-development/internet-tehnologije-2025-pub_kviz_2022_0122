import Button from "@/components/Button";
import type { TeamResponse } from "@/constants/types";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

interface AllTeamsProps {
  teamData: TeamResponse | null;
}

export default function AllTeams({ teamData }: AllTeamsProps) {
  const [allTeams, setAllTeams] = useState<TeamResponse[]>([]);
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
          console.error("Greška pri dohvatanju svih timova:", data);
          setAllTeams([]);
        }
      } catch (err) {
        console.error("Greška pri dohvatanju svih timova:", err);
        setAllTeams([]);
      }
    };

    fetchAllTeams();
  }, [user?.id, status]);
  return (
    <div className="lg:col-span-3 border-2 border-pub-orange bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-black">Svi timovi</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTeams.map((team) => (
          <div
            key={team.id}
            className="group border-2 border-pub-orange/30 rounded-xl p-5 hover:border-pub-orange hover:shadow-lg transition-all bg-linear-to-br from-white to-orange-50/30"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-black group-hover:text-pub-orange transition">
                  {team.name}
                </h3>
                <p className="text-sm text-gray-600">{} članova</p>
              </div>
              <div className="w-12 h-12 bg-pub-orange/20 rounded-full flex items-center justify-center text-2xl text-pub-gray">
                {team.name.charAt(0)}
              </div>
            </div>

            <div className="flex gap-4 mb-4 text-sm">
              <div>
                <div className="font-semibold text-pub-orange">
                  {team.captain.id ? team.captain.name : "Nepoznato"}
                </div>
                <div className="text-gray-500">kapiten</div>
              </div>
            </div>

            {!teamData?.id && (
              <Button
                onClick={() => console.log("Zahtev za:", team.id)}
                label="Pošalji zahtev"
              />
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
    </div>
  );
}