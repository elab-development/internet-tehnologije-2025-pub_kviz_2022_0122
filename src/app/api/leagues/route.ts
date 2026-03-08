import { db } from "@/db";
import { leagues } from "@/db/schema";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /leagues:
 *   get:
 *     tags: [Leagues]
 *     summary: Dohvati sve lige
 *     description: Vraća listu svih liga
 *     responses:
 *       200:
 *         description: Lista liga
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/League'
 *       500:
 *         description: Greška na serveru
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
  try {
    const allLeagues = await db.select().from(leagues);
    return NextResponse.json(allLeagues, { status: 200 });
  } catch (error) {
    console.error("Error fetching leagues:", error);
    return NextResponse.json(
      { error: "Greška pri dohvatanju liga" },
      { status: 500 },
    );
  }
}
