import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
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
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
          teamId: users.teamId,
          captain: users.captain,
        })
        .from(users);

      return NextResponse.json(rows);
    }

    const userIdNumber = parseInt(requestedUserId, 10);

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        teamId: users.teamId,
        captain: users.captain,
      })
      .from(users)
      .where(eq(users.id, userIdNumber));

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Korisnik ne postoji" },
        { status: 404 },
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Users API error:", error);

    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }

    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}
