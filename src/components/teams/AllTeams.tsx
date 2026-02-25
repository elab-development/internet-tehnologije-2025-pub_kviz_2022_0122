import Button from "@/components/Button";
import type { TeamResponse } from "@/constants/types";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function AllTeams() {
  const [allTeams, setAllTeams] = useState<TeamResponse[]>([]);

  const router = useRouter();

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

  const filteredTeams = useMemo(() => {
    return allTeams.filter((team) =>
      team.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [allTeams, search]);

  return (
    <div className="lg:col-span-3 bg-transparent shadow-xl rounded-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Svi timovi</h2>

        <input
          type="text"
          placeholder="Pretraži tim..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            px-4 py-2
            border-2 border-pub-gray/50
            rounded-xl
            outline-none
            focus:border-pub-orange
            focus:ring-1 focus:ring-pub-orange/20
            transition
            w-full md:w-64
            text-white
          "
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="
              group border border-pub-gray/50
              rounded-xl p-5
              hover:border-pub-orange hover:shadow-lg
              transition-all
              bg-transparent text-white hover:bg-white/10
            "
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-pub-beige group-hover:text-pub-orange transition">
                  {team.name}
                </h3>
              </div>

              <div className="w-12 h-12 bg-linear-to-br from-pub-orange to-orange-400 rounded-full flex items-center justify-center text-2xl text-white ">
                {team.name.charAt(0)}
              </div>
            </div>

            <div className="flex gap-4 mb-4 text-sm">
              <div>
                <div className="font-semibold text-pub-orange">
                  {team.captain?.name ?? "Nepoznato"}
                </div>
                <div className="text-white/80">kapiten</div>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/team/${team.id}`)}
              label="Pogledaj tim"
            />
          </div>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center text-white mt-6">
          Nema pronađenih timova
        </div>
      )}
    </div>
  );
}
