import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
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

    const rows = await db.select().from(events);

    const eventsList = rows.map((e) => ({
      id: e.id.toString(),
      name: e.name,
      date: e.eventDate.toISOString(),
      location: e.location,
      capacity: e.capacity,
      theme: e.theme || undefined,
      price: e.price,
    }));

    return NextResponse.json(eventsList);
  } catch (error) {
    console.error("API Team Error:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}
