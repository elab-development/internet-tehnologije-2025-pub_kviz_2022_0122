import { db } from "@/db";
import { eventRegistrations, eventResults, events, teams } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId: eventStr } = await params;
    const eventId = parseInt(eventStr);

    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!event.length) {
      return NextResponse.json(
        { error: "Event nije pronađen" },
        { status: 404 },
      );
    }

    const eventDate = new Date(event[0].eventDate);
    const now = new Date();
    if (eventDate >= now) {
      const teamsData = await db
        .select({
          teamId: teams.id,
          teamName: teams.name,
          registrationDate: eventRegistrations.registeredAt,
        })
        .from(eventRegistrations)
        .innerJoin(teams, eq(eventRegistrations.teamId, teams.id))
        .where(eq(eventRegistrations.eventId, eventId));

      return NextResponse.json({
        status: "UPCOMING",
        teams: teamsData,
      });
    } else {
      const results = await db
        .select({
          teamId: teams.id,
          teamName: teams.name,
          placement: eventResults.placement,
        })
        .from(eventResults)
        .innerJoin(teams, eq(eventResults.teamId, teams.id))
        .where(eq(eventResults.eventId, eventId))
        .orderBy(eventResults.placement);

      return NextResponse.json({
        status: "FINISHED",
        results,
      });
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
    return NextResponse.json(
      { error: "Greška pri dohvatanju detalja događaja" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId: eventStr } = await params;
    const eventId = parseInt(eventStr);

    // Proveravamo autentifikaciju
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Niste autentifikovani" },
        { status: 401 },
      );
    }

    const payload = verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Nevažeći token" }, { status: 401 });
    }

    // Provera da li je korisnik ADMIN ili ORGANIZER
    if (payload.role !== "ADMIN" && payload.role !== "ORGANIZER") {
      return NextResponse.json(
        { error: "Samo administratori i organizatori mogu obrisati događaj" },
        { status: 403 },
      );
    }

    // Provera da li događaj postoji
    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!event.length) {
      return NextResponse.json(
        { error: "Event nije pronađen" },
        { status: 404 },
      );
    }

    await db
      .delete(eventRegistrations)
      .where(eq(eventRegistrations.eventId, eventId));

    await db.delete(eventResults).where(eq(eventResults.eventId, eventId));

    await db.delete(events).where(eq(events.id, eventId));

    return NextResponse.json(
      { message: "Događaj je uspešno obrisan" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Greška pri brisanju događaja" },
      { status: 500 },
    );
  }
}
