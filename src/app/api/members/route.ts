import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestedTeamId = searchParams.get("id");

  if (requestedTeamId == undefined || requestedTeamId == null || requestedTeamId.trim() === "") {
    return NextResponse.json(
      { error: "teamId query parameter is required" },
      { status: 400 },
    );
  }

  const idNumber = Number(requestedTeamId);
  if (!idNumber || Number.isNaN(idNumber) || idNumber <= 0) {
    return NextResponse.json(
      { error: "teamId query parameter is invalid" },
      { status: 400 },
    );
  }

  try {
    const members = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.teamId, idNumber));

    if (members.length === 0) {
      return NextResponse.json(
        { error: "Tim nema ni jednog clana" },
        { status: 404 },
      );
    }

    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 },
    );
  }
}
