"use client";
import { useState } from "react";
import type { EventItem } from "@/constants/types";
import Button from "@/components/Button";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

interface EventHeaderProps {
  event: EventItem;
  registeredTeamsCount: number;
}

export default function EventHeader({
  event,
  registeredTeamsCount,
}: EventHeaderProps) {
  const [events, setEvents] = useState<EventItem[]>([]);

  const { user } = useAuth();
  const router = useRouter();
  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("sr-RS", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (id: string | number) => {
    const confirmDelete = confirm(
      "Da li ste sigurni da želite da obrišete događaj?",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Greška pri brisanju");
      }

      setEvents((prev) => prev.filter((e) => e.id !== id));
      alert("Događaj je uspešno obrisan!");
      router.push("/events");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-linear-to-r from-pub-orange/20 to-orange-500/10 rounded-2xl p-8 mb-8 border border-pub-orange/30">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2">{event.name}</h1>
          {event.theme && (
            <p className="text-orange-300 text-lg mb-2">Tema: {event.theme}</p>
          )}
          <p className="text-white/80 text-lg">{formatDateTime(event.date)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-pub-orange/30">
        <div>
          <p className="text-white/60 text-sm font-semibold mb-1">LOKACIJA</p>
          <p className="text-lg text-white">{event.location}</p>
        </div>
        <div>
          <p className="text-white/60 text-sm font-semibold mb-1">KAPACITET</p>
          <p className="text-lg text-white">
            {registeredTeamsCount} / {event.capacity}
          </p>
        </div>
        <div>
          <p className="text-white/60 text-sm font-semibold mb-1">CENA</p>
          <p className="text-lg text-white">{event.price} RSD</p>
        </div>
        {(user?.role === "ADMIN" || user?.role === "ORGANIZER") && (
          <Button
            onClick={() => handleDelete(event.id)}
            label="Obriši događaj"
            delete={true}
          />
        )}
      </div>
    </div>
  );
}
