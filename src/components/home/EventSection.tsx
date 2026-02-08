"use client";

import ButtonLink from "../Button";
import InfoCard from "../InfoCard";
import { eventsTableItems } from "../../constants/eventsTableItems";
import { useEffect, useState } from "react";

type EventItem = {
  id: string | number;
  name: string;
  date: string;
  location?: string;
  capacity: number;
};
export default function EventSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/events")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load events");
        return res.json();
      })
      .then((data) => {
        if (mounted)
          setEvents(Array.isArray(data) ? data : (data?.events ?? []));
      })
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const onSignUp = async (eventId: EventItem["id"]) => {
    await fetch(`/api/events/${eventId}/signup`, { method: "POST" });
  };

  const formatDate = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const mmm = months[d.getMonth()];
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mmm}-${dd}`;
  };

  const formatTime = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}h`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <section className="py-20 bg-transparent text-white z-10 relative">
      <div className="xl:container mx-auto xl:px-20 px-4">
        <h2 className="md:text-4xl text-3xl font-bold mt-10 mb-8 text-center">
          Nadolazeći događaji
        </h2>

        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:hidden place-items-center">
          {events.map((event) => (
            <InfoCard
              key={event.id}
              title={event.name}
              fields={[
                { label: "Naziv", value: event.name },
                { label: "Lokacija", value: event.location },
                {
                  label: "Datum",
                  value: `${formatDate(event.date)} ${formatTime(event.date)}`,
                },
                { label: "Kapacitet", value: event.capacity },
              ]}
              action={
                <ButtonLink href={`/events/${event.id}`} label="Detalji" />
              }
            />
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white/60 overflow-hidden">
            <thead className="bg-pub-blue">
              <tr>
                {eventsTableItems.map((item) => (
                  <th
                    key={item.key}
                    className="px-4 py-3 text-left text-sm font-semibold text-white"
                  >
                    {item.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border border-pub-blue text-pub-blue"
                >
                  {eventsTableItems.map((item) => (
                    <td key={item.key} className="px-4 py-4">
                      {item.key === "event_date" &&
                        `${formatDate(event.date)} ${formatTime(event.date)}`}
                      {item.key === "action" && (
                        <ButtonLink
                          href={`/events/${event.id}`}
                          label="Detalji"
                        />
                      )}

                      {["name", "theme", "location", "capacity"].includes(
                        item.key,
                      ) && (event as any)[item.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}