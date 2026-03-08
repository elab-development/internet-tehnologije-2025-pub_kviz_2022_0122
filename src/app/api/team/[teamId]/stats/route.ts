import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events, eventResults, seasons, teams } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { eq, avg, sql, and, count } from "drizzle-orm";

type Params = { params: Promise<{ teamId: string }> };

/**
 * @swagger
 * /team/{teamId}/stats:
 *   get:
 *     tags: [Teams]
 *     summary: Dohvati statistiku tima
 *     description: Vraća statistiku tima po sezonama (prosečni poeni, broj događaja)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: teamId
 *         in: path
 *         description: ID tima
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Statistika tima
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamStats'
 *       400:
 *         description: Nevalidan ID tima
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Korisnik nije ulogovan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(req: NextRequest, { params }: Params) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTH_COOKIE)?.value;

        if (!token) {
            return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
        }

        verifyAuthToken(token);
        const { teamId } = await params;
        const teamIdNum = parseInt(teamId, 10);

        if (isNaN(teamIdNum)) {
            return NextResponse.json({ error: "Nevalidan ID tima" }, { status: 400 });
        }

        const stats = await db
            .select({
                seasonId: seasons.id,
                seasonName: seasons.name,
                teamId: teams.id,
                teamName: teams.name,
                avgPoints: avg(eventResults.points),
                totalEvents: count(eventResults.id),
            })
            .from(eventResults)
            .innerJoin(events, eq(eventResults.eventId, events.id))
            .innerJoin(seasons, eq(events.seasonId, seasons.id))
            .innerJoin(teams, eq(eventResults.teamId, teams.id))
            .where(eq(eventResults.teamId, teamIdNum))
            .groupBy(seasons.id, seasons.name, teams.id, teams.name)
            .orderBy(seasons.id);

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Stats API error:", error);
        return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
    }
}
