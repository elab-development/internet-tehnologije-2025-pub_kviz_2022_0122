"use client";

import { useEffect, useState } from "react";
import { EventItem } from "@/constants/types";
import type { TeamPoints } from "@/constants/types";
import EventHeader from "@/components/events/EventHeader";
import UpcomingEventSection from "@/components/events/UpcomingEventSection";
import PastEventDetails from "@/components/events/PastEventDetails";

interface SpecificEventPageProps {
  eventId: string;
  event: EventItem;
}

export default function SpecificEventPage({
  eventId,
  event,
}: SpecificEventPageProps) {
  const [teams, setTeams] = useState<TeamPoints[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpcoming, setIsUpcoming] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/events/${eventId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Greška pri učitavanju timova");
        }

        const data = await res.json();
        if (data.status === "UPCOMING") {
          setTeams(data.teams);
          setIsUpcoming(true);
        } else {
          setTeams(data.results);
          setIsUpcoming(false);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [eventId, event.date]);

  if (loading) {
    return (
      <section className="py-20 bg-transparent text-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center text-xl">Učitavanje događaja...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-transparent text-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center text-xl text-red-400">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-30 bg-transparent text-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <EventHeader event={event} registeredTeamsCount={teams.length} />

        {isUpcoming && (
          <UpcomingEventSection
            eventId={eventId}
            teams={teams}
            onTeamsUpdated={setTeams}
          />
        )}

        {!isUpcoming && (
          <PastEventDetails
            eventId={eventId}
            teams={teams}
            onTeamsUpdated={setTeams}
          />
        )}
      </div>
    </section>
  );
}
