import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, eventRegistrations } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";

async function isCaptainOfRegisteredTeam(
  userId: number,
  teamId: number,
): Promise<boolean> {
  const result = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.id, userId),
        eq(users.teamId, teamId),
        eq(users.captain, true),
      ),
    );

  return result.length > 0;
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    }

    const user = verifyAuthToken(token);

    const body = await req.json();
    const { eventId, teamId } = body;

    if (!eventId || !teamId) {
      return NextResponse.json(
        { error: "Nedostaju obavezni podaci" },
        { status: 400 },
      );
    }

    const isCaptain = await isCaptainOfRegisteredTeam(
      parseInt(user.sub),
      parseInt(teamId),
    );

    if (!isCaptain) {
      return NextResponse.json(
        { error: "Samo kapiten tima može prijaviti tim na događaj" },
        { status: 403 },
      );
    }

    await db.insert(eventRegistrations).values({
      eventId: parseInt(eventId),
      teamId: parseInt(teamId),
    });

    return NextResponse.json(
      { success: true, message: "Tim je uspešno prijavljen" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering team:", error);
    return NextResponse.json(
      { error: "Greška pri prijavljivanju tima" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    }

    const user = verifyAuthToken(token);

    const body = await req.json();
    const { eventId, teamId } = body;

    if (!eventId || !teamId) {
      return NextResponse.json(
        { error: "Nedostaju obavezni podaci" },
        { status: 400 },
      );
    }

    const isCaptain = await isCaptainOfRegisteredTeam(
      parseInt(user.sub),
      parseInt(teamId),
    );

    if (!isCaptain) {
      return NextResponse.json(
        { error: "Samo kapiten tima može odjaviti tim sa događaja" },
        { status: 403 },
      );
    }

    await db
      .delete(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, parseInt(eventId)),
          eq(eventRegistrations.teamId, parseInt(teamId)),
        ),
      );

    return NextResponse.json(
      { success: true, message: "Tim je uspešno odjavio sa događaja" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error in DELETE:", err);
    return NextResponse.json({ error: "Sesija nevalidna" }, { status: 401 });
  }
}
