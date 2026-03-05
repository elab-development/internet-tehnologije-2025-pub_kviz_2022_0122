"use client";
import EventSection from "@/components/events/EventSection";
import { useEffect, useState } from "react";
import type { EventItem } from "@/constants/types";
import PastEventsSection from "@/components/events/PastEventsSection";

export default function EventsPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/events")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load events");
        return res.json();
      })
      .then((data) => {
        if (mounted) {
          const allEvents = Array.isArray(data) ? data : (data?.events ?? []);
          setEvents(allEvents);
        }
      })
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <EventSection allEvents={events} />
      <PastEventsSection allEvents={events} />
    </>
  );
}
