import { db } from "@/db";
import { eventResults, teams, events } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, inArray, asc, desc, sum } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ seasonId: string }> },
) {
  try {
    const { seasonId: seasonIdStr } = await params;
    const seasonId = parseInt(seasonIdStr);

    const results = await db
      .select({
        placement: sum(eventResults.placement),
        teamId: eventResults.teamId,
        teamName: teams.name,
      })
      .from(teams)
      .leftJoin(eventResults, eq(eventResults.teamId, teams.id))
      .leftJoin(events, eq(eventResults.eventId, events.id))
      .where(eq(events.seasonId, seasonId))
      .groupBy(eventResults.teamId, teams.name)
      .orderBy(desc(sum(eventResults.placement)));

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error fetching season standings:", error);
    return NextResponse.json(
      { error: "Greška pri dohvatanju tabele" },
      { status: 500 },
    );
  }
}
