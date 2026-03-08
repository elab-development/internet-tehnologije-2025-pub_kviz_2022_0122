import { db } from "@/db";
import { eventResults, teams, events, leagues, seasons } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, inArray, asc, desc, sum, sql, and, isNull } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ seasonId: string }> },
) {
  try {
    const { seasonId: seasonIdStr } = await params;
    const seasonIdREQ = parseInt(seasonIdStr);

    const results = await db
      .select({
        totalPoints: sum(eventResults.points),
        teamId: eventResults.teamId,
        teamName: teams.name,
      })
      .from(teams)
      .leftJoin(eventResults, eq(eventResults.teamId, teams.id))
      .leftJoin(events, eq(eventResults.eventId, events.id))
      .where(eq(events.seasonId, seasonIdREQ))
      .groupBy(eventResults.teamId, teams.name)
      .orderBy(desc(sum(eventResults.points)));

    //   const leagueSubquery = db
    //   .select({ leagueId: seasons.leagueId })
    //   .from(seasons)
    //   .where(eq(seasons.id, seasonIdREQ));
    
    //   const resultsWith0 = await db
    //   .select({
    //     totalPoints: sql`0`,
    //     teamId: teams.id,
    //     teamName: teams.name,
    //   })
    //   .from(teams)
    //   .leftJoin(eventResults, eq(teams.id, eventResults.teamId))
    //   .where(and(
    //   eq(teams.leagueId, leagueSubquery),
    //   isNull(eventResults.teamId)
    // ));

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error fetching season standings:", error);
    return NextResponse.json(
      { error: "Greška pri dohvatanju tabele" },
      { status: 500 },
    );
  }
}
