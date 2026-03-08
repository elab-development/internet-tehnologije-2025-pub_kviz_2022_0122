import { db } from "@/db";
import { eventResults } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";

/**
 * @swagger
 * /events/{eventId}/results:
 *   put:
 *     tags: [Events]
 *     summary: Ažuriraj rezultate događaja
 *     description: Ažurira rezultate timova za određeni događaj (samo admin/organizator)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         description: ID događaja
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [results]
 *             properties:
 *               results:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     eventId:
 *                       type: integer
 *                     teamId:
 *                       type: integer
 *                     points:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Rezultati uspešno ažurirani
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Korisnik nije ulogovan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Samo administratori mogu ažurirati rezultate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    }

    const user = verifyAuthToken(token);

    if (user.role !== "ADMIN" && user.role !== "ORGANIZER") {
      return NextResponse.json(
        { error: "Samo administratori mogu ažurirati rezultate" },
        { status: 403 },
      );
    }

    const { eventId: eventStr } = await params;
    const eventId = parseInt(eventStr);

    const body = await request.json();
    const { results } = body;

    if (!results || !Array.isArray(results)) {
      return NextResponse.json(
        { error: "Nevaljani format rezultata" },
        { status: 400 },
      );
    }

    // Delete existing results for this event
    await db.delete(eventResults).where(eq(eventResults.eventId, eventId));

    // Insert new results
    for (const result of results) {
      await db.insert(eventResults).values({
        eventId: result.eventId,
        teamId: result.teamId,
        points: result.points,
      });
    }

    return NextResponse.json(
      { success: true, message: "Rezultati su uspešno ažurirani" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating event results:", error);
    return NextResponse.json(
      { error: "Greška pri ažuriranju rezultata" },
      { status: 500 },
    );
  }
}
