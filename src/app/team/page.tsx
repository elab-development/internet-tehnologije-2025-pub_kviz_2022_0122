"use client";
import { useAuth } from "@/components/AuthProvider";
import { MyTeam } from "@/components/teams/MyTeam";

export default function EventsPage() {
  const { user } = useAuth();

  return <MyTeam userId={user?.id} />;
}