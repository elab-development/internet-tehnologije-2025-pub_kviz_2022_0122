import { db } from "@/db";
import { teamJoinRequests, teams } from "@/db/schema";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    
    if (!token) {
        return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedTeamId = searchParams.get("id"); 

    try {
        const user = verifyAuthToken(token);
    
        if (!requestedTeamId) {
            return NextResponse.json({ error: "Team ID nije pronađen" }, { status: 400 });
        }

        await db.insert(teamJoinRequests).values({
            teamId: parseInt(requestedTeamId),
            userId: Number(user.sub)
        });

        return NextResponse.json({ message: "Zahtev poslat" }, { status: 200 });
    
      } catch(err: any) {
        return NextResponse.json({ err }, { status: 401 });
      }
}