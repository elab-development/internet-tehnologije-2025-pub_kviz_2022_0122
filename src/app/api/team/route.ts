import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teams, teamMembers, users } from "@/db/schema";
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
          return NextResponse.json(
            { error: "Token je istekao ili je nevalidan" },
            { status: 401 },
          );
        }

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("id"); 

    if (!requestedUserId) {
      const rows = await db
      .select({
        id: teams.id,
        name: teams.name,
        createdAt: teams.createdAt,
        captain: {
          id: users.id,
          name: users.name,
        },
      })
      .from(teams)
      .leftJoin(users, eq(teams.captainId, users.id));

    return NextResponse.json(rows);
    }

    const userIdNumber = parseInt(requestedUserId, 10);

    const rows = await db
      .select({
        id: teams.id,
        name: teams.name,
        createdAt: teams.createdAt,
        captain: {
          id: users.id,
          name: users.name,
        },
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .innerJoin(users, eq(teams.captainId, users.id))
      .where(eq(teamMembers.userId, userIdNumber));

    if (rows.length === 0) {
      return NextResponse.json({ error: "Korisnik nije član nijednog tima" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);

  } catch (error) {
    console.error("Team API error:", error);
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}