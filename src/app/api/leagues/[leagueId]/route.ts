import { db } from "@/db";
import { leagues, seasons } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

/**
 * @swagger
 * /leagues/{leagueId}:
 *   get:
 *     tags: [Leagues]
 *     summary: Dohvati ligu sa sezonama
 *     description: Vraća detalje o ligi uključujući sve sezone
 *     parameters:
 *       - name: leagueId
 *         in: path
 *         description: ID lige
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalji lige
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeagueWithSeasons'
 *       404:
 *         description: Liga nije pronađena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ leagueId: string }> },
) {
  try {
    const { leagueId: leagueIdStr } = await params;
    const leagueId = parseInt(leagueIdStr);

    const league = await db
      .select()
      .from(leagues)
      .where(eq(leagues.id, leagueId));

    if (league.length === 0) {
      return NextResponse.json(
        { error: "Liga nije pronađena" },
        { status: 404 },
      );
    }

    const leagueSeasons = await db
      .select()
      .from(seasons)
      .where(eq(seasons.leagueId, leagueId));

    return NextResponse.json(
      {
        ...league[0],
        seasons: leagueSeasons,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching league:", error);
    return NextResponse.json(
      { error: "Greška pri dohvatanju lige" },
      { status: 500 },
    );
  }
}
