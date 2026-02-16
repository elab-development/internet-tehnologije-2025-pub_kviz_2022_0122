import { db } from "@/db";
import { eventResults, teams, events } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, inArray, asc } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ seasonId: string }> },
) {
  try {
    const { seasonId: seasonIdStr } = await params;
    const seasonId = parseInt(seasonIdStr);

    const seasonEvents = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.seasonId, seasonId));

    const eventIds = seasonEvents.map((event) => event.id);

    if (eventIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const results = await db
      .select({
        placement: eventResults.placement,
        teamId: eventResults.teamId,
        teamName: teams.name,
      })
      .from(eventResults)
      .innerJoin(teams, eq(eventResults.teamId, teams.id))
      .where(inArray(eventResults.eventId, eventIds))
      .orderBy(asc(eventResults.placement));

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error fetching season standings:", error);
    return NextResponse.json(
      { error: "Greška pri dohvatanju tabele" },
      { status: 500 },
    );
  }
}
