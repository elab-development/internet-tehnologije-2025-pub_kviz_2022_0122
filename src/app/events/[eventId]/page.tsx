import SpecificEventPage from "@/components/events/SpecificEventPage";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { EventItem } from "@/constants/types";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  try {
    const [event] = await db
      .select({
        id: events.id,
        name: events.name,
        date: events.eventDate,
        location: events.location,
        capacity: events.capacity,
        theme: events.theme,
        price: events.price,
      })
      .from(events)
      .where(eq(events.id, parseInt(eventId)));

    if (!event) {
      return (
        <div className="min-h-screen text-white p-8">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold mb-2">Događaj nije pronađen</h1>
            <p className="text-white/60">ID: {eventId}</p>
          </div>
        </div>
      );
    }

    const eventData: EventItem & { theme?: string; location: string } = {
      id: event.id.toString(),
      name: event.name,
      date: event.date.toISOString(),
      location: event.location,
      capacity: event.capacity,
      theme: event.theme || undefined,
      price: Number(event.price),
    };

    return <SpecificEventPage eventId={eventId} event={eventData} />;
  } catch (error) {
    console.error("Error fetching event:", error);
    return (
      <div className="min-h-screen text-white p-8">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2 text-red-400">
            Greška pri učitavanju događaja
          </h1>
        </div>
      </div>
    );
  }
}
