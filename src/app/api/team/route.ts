import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teams, teamMembers } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    }

    let claims;
    try {
      claims = verifyAuthToken(token);
    } catch (err) {
      return NextResponse.json({ error: "Token je istekao ili je nevalidan" }, { status: 401 });
    }

    const userId = parseInt(claims.sub, 10);
    const uId = parseInt(claims.sub, 10);
    const rows = await db
      .select({
        userId: teamMembers.userId,
        team: {
          id: teams.id,
          name: teams.name,
        },
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(eq(teamMembers.userId, uId));


    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Tim nije pronađen" }, { status: 404 });
    }

    return NextResponse.json({ 
      userId: rows[0].userId, 
      team: rows[0].team 
    });

  } catch (error) {
    console.error("API Team Error:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}