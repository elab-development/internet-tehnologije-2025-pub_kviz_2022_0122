"use client";

import React, { useEffect, useState } from "react";
import Button from "../Button";

type TeamMember = {
  id: string | number;
  name: string;
  avatar?: string;
  score: number;
  rank?: number;
};

type TeamStats = {
  totalQuizzes: number;
  wins: number;
  averageScore: number;
  rank: number;
};

type TeamResponse = {
  userId: string | number;
  team: {
    id: string | number;
    name: string;
    description?: string;
    members?: TeamMember[];
    stats?: TeamStats;
    captain?: string;
  };
};

export const MyTeam: React.FC = () => {
  const [teamData, setTeamData] = useState<TeamResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch("/api/team", {
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data?.error || "Failed to fetch team data");
        setTeamData(data);
      } catch (err) {
        console.error("An error occurred:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Učitavanje...</div>
      </div>
    );
  }

  const allTeams = [
    { id: 1, name: "Tim A", memberCount: 5, wins: 12, avgScore: 850 },
    { id: 2, name: "Tim B", memberCount: 3, wins: 8, avgScore: 720 },
    { id: 3, name: "Tim C", memberCount: 8, wins: 15, avgScore: 920 },
  ];

  const mockMembers: TeamMember[] = [
    { id: 1, name: "Marko P.", score: 1250, rank: 1 },
    { id: 2, name: "Ana S.", score: 1100, rank: 2 },
    { id: 3, name: "Stefan M.", score: 980, rank: 3 },
    { id: 4, name: "Jelena K.", score: 850, rank: 4 },
    { id: 5, name: "Nikola D.", score: 720, rank: 5 },
  ];

  const mockStats: TeamStats = {
    totalQuizzes: 24,
    wins: 15,
    averageScore: 880,
    rank: 3,
  };

  return (
    <div className="min-h-screen px-4 py-10 mt-20">
      <div className="container mx-auto max-w-7xl space-y-8">
        <div className="relative overflow-hidden border-2 border-pub-orange bg-linear-to-br from-white to-orange-50 shadow-2xl rounded-2xl p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pub-orange opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pub-orange opacity-10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            {teamData?.team ? (
              <div className="text-center md:text-left">
                <div className="inline-block px-4 py-1 bg-pub-orange/20 rounded-full mb-4">
                  <span className="text-pub-orange font-semibold text-sm">
                    Rang #{mockStats.rank}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3 text-black">
                  {teamData.team.name}
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                  {teamData.team.description || "Spremni za sledeći kviz!"}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-pub-orange/30">
                    <div className="text-3xl font-bold text-pub-orange">
                      {mockStats.wins}
                    </div>
                    <div className="text-sm text-gray-600">Pobede</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-pub-orange/30">
                    <div className="text-3xl font-bold text-pub-orange">
                      {mockStats.totalQuizzes}
                    </div>
                    <div className="text-sm text-gray-600">Kvizovi</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-pub-orange/30">
                    <div className="text-3xl font-bold text-pub-orange">
                      {mockMembers.length}
                    </div>
                    <div className="text-sm text-gray-600">Članovi</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-pub-orange/30">
                    <div className="text-3xl font-bold text-pub-orange">
                      {mockStats.averageScore}
                    </div>
                    <div className="text-sm text-gray-600">Prosek</div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {teamData?.team && (
            <div className="lg:col-span-2 border-2 border-pub-orange bg-white shadow-xl rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                  Članovi tima
                </h2>
                <span className="text-sm text-gray-500">
                  {mockMembers.length} ukupno
                </span>
              </div>

              <div className="space-y-3">
                {mockMembers.map((member, index) => (
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
                          {index === 0 && (
                            <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                              Kapiten
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Rang #{member.rank}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-pub-orange text-lg">
                        {member.score}
                      </div>
                      <div className="text-xs text-gray-500">poena</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {teamData?.team && (
            <div className="border-2 border-pub-orange bg-white shadow-xl rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-black flex items-center gap-2">
                Dostignuća
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-300">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="font-semibold text-black">Prvak lige</div>
                  <div className="text-sm text-gray-600">
                    3 uzastopne pobede
                  </div>
                </div>

                <div className="p-4 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-300">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="font-semibold text-black">Preciznost</div>
                  <div className="text-sm text-gray-600">
                    95% tačnost ovaj mesec
                  </div>
                </div>

                <div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-300">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="font-semibold text-black">Brza ekipa</div>
                  <div className="text-sm text-gray-600">
                    Rekord: 45s po kvizu
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-3 text-black">
                  Poslednja aktivnost
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Pobeda u "Istorija kvizu"
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Ana S. pridružila timu
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Novo dostignuće otkljucano
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="lg:col-span-3 border-2 border-pub-orange bg-white shadow-xl rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-black">
              {teamData?.team ? "Drugi timovi" : "Dostupni timovi"}
            </h2>

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
                      <p className="text-sm text-gray-600">
                        {team.memberCount} članova
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-pub-orange/20 rounded-full flex items-center justify-center text-2xl">
                      {team.name.charAt(0)}
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4 text-sm">
                    <div>
                      <div className="font-semibold text-pub-orange">
                        {team.wins}
                      </div>
                      <div className="text-gray-500">pobeda</div>
                    </div>
                    <div>
                      <div className="font-semibold text-pub-orange">
                        {team.avgScore}
                      </div>
                      <div className="text-gray-500">prosek</div>
                    </div>
                  </div>

                  {!teamData?.team && (
                    <Button
                      onClick={() => console.log("Zahtev za:", team.id)}
                      label="Pošalji zahtev"
                    />
                  )}

                  {teamData?.team && (
                    <Button
                      onClick={() => console.log("Pogledaj:", team.id)}
                      label="Pogledaj tim"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
