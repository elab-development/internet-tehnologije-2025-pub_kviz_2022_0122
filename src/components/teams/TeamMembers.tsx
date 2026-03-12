"use client";

import type { TeamMember, TeamResponse } from "@/constants/types";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

interface TeamMembersProps {
  teamData: TeamResponse | null;
}

export default function TeamMembers({ teamData }: TeamMembersProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, status } = useAuth();

  useEffect(() => {
    if (!teamData?.id || status === "loading") return;

    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`/api/members?id=${teamData.id}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setTeamMembers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Greška pri dohvatanju članova:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [teamData?.id, status]);

  if (!teamData?.id) return null;

  if (loading) {
    return (
      <div className="lg:flex-2 bg-transparent shadow-xl rounded-2xl p-6 text-white">
        Učitavanje članova...
      </div>
    );
  }

  return (
    <div className="lg:flex-2 bg-transparent shadow-xl rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Članovi tima</h2>

        <span className="text-sm text-white/80">
          {teamMembers.length} ukupno
        </span>
      </div>

      <div className="space-y-3">
        {teamMembers.map((member) => {
          const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`;

          return (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-transparent border-b border-pub-gray/50 rounded-xl hover:shadow-md transition-all"
            >
              <Link
                href={`/profile/${member.id}`}
                className="flex items-center gap-4"
              >
                <img
                  src={avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full"
                />

                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    {member.name}

                    {member.id === teamData.captain?.id && (
                      <span className="text-xs bg-yellow-300 mx-2 text-black px-4 py-0.5 rounded-full">
                        Kapiten
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
