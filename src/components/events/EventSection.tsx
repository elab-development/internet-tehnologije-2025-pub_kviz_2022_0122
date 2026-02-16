"use client";

import Button from "@/components/Button";
import ButtonLink from "@/components/Button";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { usePathname, useRouter } from "next/navigation";

type EventItem = {
  id: string | number;
  name: string;
  date: string;
  location?: string;
  capacity: number;
  theme?: string;
};

export default function EventSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

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

  const { user } = useAuth();

  const formatTime = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const getDayOfMonth = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return String(d.getDate()).padStart(2, "0");
  };

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
  const handleDelete = async (id: string | number) => {
    const confirmDelete = confirm(
      "Da li ste sigurni da želite da obrišete događaj?",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/events?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Greška pri brisanju");
      }

      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-transparent text-white z-10 relative">
        <div className="xl:container mx-auto xl:px-20 px-4">
          <div className="text-center text-xl">Učitavanje događaja...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-transparent text-white z-10 relative">
        <div className="xl:container mx-auto xl:px-20 px-4">
          <div className="text-center text-xl text-red-400">
            Greška: {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-transparent text-white z-10 relative">
      <div className="xl:container mx-auto xl:px-20 px-4">
        <div className="text-center mb-12">
          <h2 className="md:text-5xl text-4xl mt-10 font-bold mb-4">
            Nadolazeći događaji
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Pridruži se našim kviz večerima i takmiči se sa najboljima!
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-xl text-white/70">
              Trenutno nema zakazanih događaja
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="group relative bg-white/10 backdrop-blur-sm border-2 border-pub-orange/50 rounded-2xl overflow-hidden 
                hover:border-pub-orange hover:shadow-2xl hover:shadow-pub-orange/20 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute top-4 right-4 bg-pub-orange text-black rounded-xl p-3 text-center shadow-lg z-10">
                  <div className="text-2xl font-bold leading-none">
                    {getDayOfMonth(event.date)}
                  </div>
                  <div className="text-xs font-semibold mt-1">
                    {getMonth(event.date)}
                  </div>
                </div>

                <div className="absolute inset-0 bg-linear-to-br from-pub-orange/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="p-6 relative z-10 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-pub-orange transition-colors pr-20">
                    {event.name}
                  </h3>

                  <div className="space-y-3 mb-6">
                    {event.theme && (
                      <div className="flex items-center gap-3 text-white/90">
                        <span className="text-pub-orange text-xl">🎯</span>
                        <div>
                          <div className="text-xs text-white/60">Tema</div>
                          <div className="font-semibold">{event.theme}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-white/90">
                      <div>
                        <div className="text-xs text-white/60">Lokacija</div>
                        <div className="font-semibold">
                          {event.location || "TBA"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-white/90">
                      <div>
                        <div className="text-xs text-white/60">Vreme</div>
                        <div className="font-semibold">
                          {formatTime(event.date)}h
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-white/90">
                      <div>
                        <div className="text-xs text-white/60">Kapacitet</div>
                        <div className="font-semibold">
                          {event.capacity} mesta
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto flex flex-col gap-4">
                    <Button
                      onClick={() => router.push(`/events/${event.id}`)}
                      label="Prijavi se →"
                    />

                    {(user?.role === "ADMIN" || user?.role === "ORGANIZER") && (
                      <Button
                        onClick={() => handleDelete(event.id)}
                        label="Obriši događaj"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {events.length > 0 && pathname !== "/events" && (
          <div className="text-center mt-12">
            <ButtonLink
              onClick={() => router.push("/events")}
              label="Svi događaji"
            />
          </div>
        )}
      </div>
    </section>
  );
}
