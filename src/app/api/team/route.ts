import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teams, teamMembers, users } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("id"); 

    if (!requestedUserId) {
      const rows = await db
      .select({
        userId: users.id,
        userName: users.name,
        team: {
          id: teams.id,
          name: teams.name,
        },
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .innerJoin(users, eq(teamMembers.userId, users.id))

    return NextResponse.json(rows);
    }

    const userIdNumber = parseInt(requestedUserId, 10);

    const rows = await db
      .select({
        userId: users.id,
        userName: users.name,
        team: {
          id: teams.id,
          name: teams.name,
        },
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(users.id, userIdNumber));

    if (rows.length === 0) {
      return NextResponse.json({ error: "Korisnik nije član nijednog tima" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);

  } catch (error) {
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}