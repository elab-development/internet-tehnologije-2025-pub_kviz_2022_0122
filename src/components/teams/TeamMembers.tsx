import type { TeamMember } from "@/constants/types";
import type { TeamResponse } from "@/constants/types";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

interface TeamMembersProps {
  teamData: TeamResponse | null;
}

export default function TeamMembers({
  teamData,
  
}: TeamMembersProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, status } = useAuth();
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

  if (!teamData?.id) {
    return null;
  }
  return (
    <div className="lg:col-span-2 border-2 border-pub-orange bg-white shadow-xl rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2">
          Članovi tima
        </h2>
        <span className="text-sm text-gray-500">
          {teamMembers.length} ukupno
        </span>
      </div>

      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-linear-to-r from-orange-50 to-white border border-pub-orange/20 rounded-xl hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pub-orange rounded-full flex items-center justify-center text-white font-bold text-lg">
                {member.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-black flex items-center gap-2">
                  {member.name}
                  {member.id === teamData.captain?.id && (
                    <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                      Kapiten
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}