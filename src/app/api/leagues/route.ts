import { db } from "@/db";
import { leagues } from "@/db/schema";
import { NextResponse } from "next/server";

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
