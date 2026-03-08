import { db } from "@/db";
import { leagues, seasons } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
/**
 * @openapi
 * /api/leagues/{leagueId}:
 *   get:
 *     description: Vraća podatke o jednoj ligi i sve sezone koje pripadaju toj ligi.
 *     parameters:
 *       - in: path
 *         name: leagueId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID lige koja se traži
 *     responses:
 *       200:
 *         description: Liga sa pripadajućim sezonama
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 seasons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Season'
 *       404:
 *         description: Liga nije pronađena
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Greška pri dohvatanju lige
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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
