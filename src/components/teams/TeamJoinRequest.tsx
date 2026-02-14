import type { TeamResponse, TeamJoinRequest } from "@/constants/types";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";

export default function TeamJoinRequest({
  teamData,
}: {
  teamData: TeamResponse | null;
}) {
  const [joinRequests, setJoinRequests] = useState<TeamJoinRequest[]>([]);
  const { user, status } = useAuth();
  

  if (!teamData?.id) {
    return null;
  }

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try{
        const response = await fetch(`/api/join?id=${teamData.id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setJoinRequests(Array.isArray(data) ? data : []);
        }else {
          console.error("Greška pri dohvatanju svih requestova:", data);
          setJoinRequests([]);
        }
      } catch (error) {
        console.error("Error fetching join requests:", error);
      }
    }
    fetchJoinRequests();
  }, [teamData?.id]);

  const handleAccept = async (userId: number) => {
    try {
      const res = await fetch(`/api/join?id=${userId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, teamId: teamData.id }),
      });

      if (!res.ok) throw new Error("Greška pri prihvatanju");

      setJoinRequests((prev) =>
        prev.filter((r) => r.userId !== userId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (userId: number) => {
    try {      
      const res = await fetch(`/api/join?id=${userId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userReqId: userId, teamReqId: teamData.id }),
      });
      if (!res.ok) throw new Error("Greška pri odbijanju");
      setJoinRequests((prev) => prev.filter((r) => r.userId !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border-2 border-pub-orange bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-black flex items-center gap-2">
        Zahtevi za članstvo
      </h2>

      {joinRequests.length === 0 ? (
        <div className="space-y-4">
          <div className="p-4 bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-300">
            <div className="text-sm text-gray-600">Nema zahteva za članstvo.</div>
          </div>
        </div>
      ) : (
        joinRequests.map((request) => (
        <div key={request.userId || request.email} className="mb-4">
  <div className="p-4 bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-300 flex items-center justify-between gap-4">
    
    <div className="min-w-0"> 
      <div className="font-semibold text-black truncate">{request.name}</div>
      <div className="text-sm text-gray-600 truncate">{request.email}</div>
    </div>

    {user?.captain && (
      <div className="flex items-center gap-2 shrink-0">
      <button 
        onClick={() => handleReject(request.userId)} 
        className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border-2 border-red-300 hover:bg-red-600 hover:text-white text-pub-gray transition-colors shadow-sm"
        title="Odbij zahtev"
      >
        ✕
      </button>
      <button 
        onClick={() => handleAccept(request.userId)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border-2 border-green-300 hover:bg-green-600 hover:text-white text-pub-gray transition-colors shadow-sm"
        title="Prihvati zahtev"
      >
        ✓
      </button>
      </div>
    )}

  </div>
</div>
        ))    
      )}
    </div>
  );
}