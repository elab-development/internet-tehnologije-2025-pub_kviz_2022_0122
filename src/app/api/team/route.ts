import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teams, teamMembers } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    // 1. Dobijanje tokena iz kolačića
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    }

    // 2. Verifikacija (Ovo će baciti grešku ako token nije aktivan)
    let claims;
    try {
      claims = verifyAuthToken(token);
    } catch (err) {
      // Ako verifyAuthToken baci grešku (istekao token i sl.)
      return NextResponse.json({ error: "Token je istekao ili je nevalidan" }, { status: 401 });
    }

    const userId = parseInt(claims.sub, 10);

    // 3. Upit u bazu
    const rows = await db
      .select({
        teamId: teams.id,
        teamName: teams.name,
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(eq(teamMembers.userId, userId));

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Tim nije pronađen" }, { status: 404 });
    }

    return NextResponse.json({ 
      userId: userId, 
      team: rows[0] 
    });

  } catch (error) {
    // Ovde hvatamo samo neočekivane greške (npr. baza ne radi)
    console.error("API Team Error:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}
