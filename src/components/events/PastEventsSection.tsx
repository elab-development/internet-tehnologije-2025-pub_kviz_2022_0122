"use client";

import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EventItem } from "@/constants/types";

export default function PastEventsSection({
  allEvents,
}: {
  allEvents?: EventItem[];
}) {
  const [past, setPast] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (allEvents) {
      const now = new Date();
      const pastEvents = allEvents.filter(
        (e: EventItem) => new Date(e.date).getTime() < now.getTime(),
      );
      setPast(pastEvents);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [allEvents]);

  const formatDate = (value: string) => {
    const d = new Date(value);
    return d.toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) return null;

  if (past.length === 0) return null;

  return (
    <section className="py-10 bg-transparent text-white">
      <div className="xl:container mx-auto xl:px-20 px-4">
        <div className="text-center mb-12">
          <h2 className="md:text-5xl text-4xl font-bold mb-4 text-white/80">
            Održani događaji
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Pogledaj kako je izgledalo prethodnih večeri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {past?.map((event) => (
            <div
              key={event.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-70 hover:opacity-100 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-4">{event.name}</h3>

              <div className="space-y-2 text-white/80 mb-6">
                <div>
                  <span className="text-white/50 text-sm">Datum:</span>{" "}
                  {formatDate(event.date)}
                </div>

                <div>
                  <span className="text-white/50 text-sm">Lokacija:</span>{" "}
                  {event.location || "TBA"}
                </div>

                {event.theme && (
                  <div>
                    <span className="text-white/50 text-sm">Tema:</span>{" "}
                    {event.theme}
                  </div>
                )}
              </div>

              <Button
                onClick={() => router.push(`/events/${event.id}`)}
                label="Detalji"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
