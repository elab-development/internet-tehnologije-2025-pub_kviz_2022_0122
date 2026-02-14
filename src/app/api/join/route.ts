import { db } from "@/db";
import { teamJoinRequests, users } from "@/db/schema";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";

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

export async function GET(req: Request) {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    
    if (!token) {
        return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedTeamId = searchParams.get("id"); 

    try{
        if (!requestedTeamId) {
            return NextResponse.json({ error: "Team ID nije pronađen" }, { status: 400 });
        }
        const teamJoinReqs = await db
        .select({
            teamId: teamJoinRequests.teamId,
            userId: users.id,
            name: users.name,
            email: users.email,
            createdAt: teamJoinRequests.createdAt,
        })
        .from(teamJoinRequests)
        .innerJoin(users, eq(teamJoinRequests.userId, users.id))
        .where(eq(teamJoinRequests.teamId, parseInt(requestedTeamId)));

        return NextResponse.json(teamJoinReqs);
    } catch(err: any) {
        return NextResponse.json({ err }, { status: 401 });
    }
}

export async function PATCH(req: Request) {
  const body = await req.json();

  const { userId, teamId } = body;

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

  try {
    await db.update(users).set({ teamId }).where(eq(users.id, userId));
    await db.delete(teamJoinRequests).where(eq(teamJoinRequests.userId, userId));
    return NextResponse.json({ message: "Korisnik dodat u tim" }, { status: 200 });
  } catch (error) {
    console.error("Error updating team membership:", error);
    return NextResponse.json({ error: "Greška pri ažuriranju članstva" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();

  const { userReqId, teamReqId } = body;
  console.log("Received DELETE request with userReqId:", userReqId, "and teamReqId:", teamReqId);
  
  if (!userReqId) {
    return NextResponse.json({ error: "User ID nije pronađen" }, { status: 400 });
  }

  try {
    await db
    .delete(teamJoinRequests)
    .where(and(eq(teamJoinRequests.userId, parseInt(userReqId)), eq(teamJoinRequests.teamId, parseInt(teamReqId))));
    return NextResponse.json({ message: "Zahtev odbijen" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting team join request:", error);
    return NextResponse.json({ error: "Greška pri brisanju zahteva" }, { status: 500 });
  }
}