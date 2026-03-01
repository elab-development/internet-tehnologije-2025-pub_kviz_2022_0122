import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

type EventItem = {
  id: string;
  name: string;
  date: string;
};

async function getAllEvents(): Promise<EventItem[]> {
  const rows = await db.select().from(events);

  return rows.map((e) => ({
    id: e.id.toString(),
    name: e.name,
    date: e.eventDate.toISOString(),
    location: e.location,
    capacity: e.capacity,
    price: e.price,
  }));
}

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

    const all = await getAllEvents();
    const now = new Date();

    const upcoming = all.filter(
      (e) => new Date(e.date).getTime() >= now.getTime(),
    );

    return NextResponse.json(upcoming);
  } catch (error) {
    console.error("API Team Error:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
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

    const isAdmin = user.role === "ADMIN";
    const isOrganizer = user.role === "ORGANIZER";

    if (!isAdmin && !isOrganizer) {
      return NextResponse.json(
        { error: "Nemate dozvolu (Samo Admin ili Organizator)" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "Nedostaje id" }, { status: 400 });
    }

    const idNumber = Number(idParam);
    if (Number.isNaN(idNumber)) {
      return NextResponse.json({ error: "Neispravan id" }, { status: 400 });
    }

    await db.delete(events).where(eq(events.id, idNumber));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Sesija nevalidna" }, { status: 401 });
  }
}
