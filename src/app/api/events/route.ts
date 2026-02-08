import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { events } from "@/db/schema";

type EventItem = {
  id: string;
  name: string;
  date: string;
};

function isAuthorized(req: NextRequest): boolean {
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader) return false;

//   const [type, token] = authHeader.split(" ");
//   if (type !== "Bearer" || !token) return false;

//   try {
//     jwt.verify(token, process.env.JWT_SECRET!);
//     return true;
//   } catch {
//     return false;
//   }
return true;
}

async function getAllEvents(): Promise<EventItem[]> {
  const rows = await db.select().from(events);

  return rows.map((e) => ({
    id: e.id.toString(),
    name: e.name,
    date: e.eventDate.toISOString(),
    location: e.location,
  }));
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const all = await getAllEvents();
  const now = new Date();

  const upcoming = all.filter(
    (e) => new Date(e.date).getTime() >= now.getTime()
  );

  return NextResponse.json(upcoming);
}
