import { useEffect, useState } from "react";
import type { TeamResponse, TeamMember } from "@/constants/types";
import { useAuth } from "@/components/AuthProvider";

interface TeamProps {
  teamData: TeamResponse | null;
}

export default function MyTeam({ teamData }: TeamProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [user?.id, status]);
  return (
    <div className="relative overflow-hidden border-2 border-pub-orange bg-linear-to-br from-white to-orange-50 shadow-2xl rounded-2xl p-8 md:p-12">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pub-orange opacity-10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-pub-orange opacity-10 rounded-full -ml-24 -mb-24"></div>

      <div className="relative z-10">
        {teamData?.id ? (
          <div className="text-center md:text-left">
            <div className="inline-block px-4 py-1 bg-pub-orange/20 rounded-full mb-4">
              <span className="text-pub-orange font-semibold text-sm">
                Vaš tim
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-black">
              {teamData.name}
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Spremni za sledeći kviz!
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-pub-orange/30">
                <div className="text-3xl font-bold text-pub-orange">
                  {teamData.captain?.name}
                </div>
                <div className="text-sm text-gray-600">Kapiten</div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-pub-orange/30">
                <div className="text-3xl font-bold text-pub-orange">
                  {getMonth(teamData.createdAt)}{" "}
                  {new Date(teamData.createdAt).getFullYear()}
                </div>
                <div className="text-sm text-gray-600">Tim kreiran</div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-pub-orange/30">
                <div className="text-3xl font-bold text-pub-orange">
                  {teamMembers.length}
                </div>
                <div className="text-sm text-gray-600">Članovi</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              Vreme je za tim!
            </h1>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Pridruži se timu i takmiči se sa drugima.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}