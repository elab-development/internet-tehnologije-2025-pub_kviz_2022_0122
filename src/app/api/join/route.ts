import { db } from "@/db";
import { teamJoinRequests, users, teams } from "@/db/schema";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";

async function isCaptain(userId: number, teamId: number): Promise<boolean> {
  const user = await db
    .select({ captain: users.captain })
    .from(users)
    .where(and(eq(users.id, userId), eq(users.teamId, teamId)));

  return user.length > 0 && user[0].captain === true;
}

/**
 * @swagger
 * /join:
 *   get:
 *     tags: [Join Requests]
 *     summary: Dohvati zahteve za pridruživanje
 *     description: Vraća listu zahteva za pridruživanje timu
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         description: ID tima (opciono)
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista zahteva
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JoinRequest'
 *       401:
 *         description: Korisnik nije ulogovan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Join Requests]
 *     summary: Pošalji zahtev za pridruživanje
 *     description: Šalje zahtev za pridruživanje timu
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         description: ID tima
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Zahtev uspešno poslat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Zahtev poslat
 *       400:
 *         description: ID tima nije pronađen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Korisnik nije ulogovan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     tags: [Join Requests]
 *     summary: Prihvati zahtev za pridruživanje
 *     description: Kapiten tima prihvata zahtev korisnika za pridruživanje
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, teamId]
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID korisnika
 *               teamId:
 *                 type: integer
 *                 description: ID tima
 *     responses:
 *       200:
 *         description: Korisnik dodat u tim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Korisnik dodat u tim
 *       401:
 *         description: Korisnik nije ulogovan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Samo kapiten tima može dodati članove
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Join Requests]
 *     summary: Odbij zahtev za pridruživanje
 *     description: Kapiten tima odbija zahtev korisnika za pridruživanje
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userReqId, teamReqId]
 *             properties:
 *               userReqId:
 *                 type: integer
 *                 description: ID korisnika
 *               teamReqId:
 *                 type: integer
 *                 description: ID tima
 *     responses:
 *       200:
 *         description: Zahtev odbijen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Zahtev odbijen
 *       400:
 *         description: User ID nije pronađen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Korisnik nije ulogovan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Samo kapiten tima može odbiti zahtev
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
      return NextResponse.json(
        { error: "Team ID nije pronađen" },
        { status: 400 },
      );
    }

    await db.insert(teamJoinRequests).values({
      teamId: parseInt(requestedTeamId),
      userId: Number(user.sub),
    });

    return NextResponse.json({ message: "Zahtev poslat" }, { status: 200 });
  } catch (err: any) {
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

  try {
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
      .where(
        requestedTeamId
          ? eq(teamJoinRequests.teamId, parseInt(requestedTeamId))
          : undefined,
      );

    return NextResponse.json(teamJoinReqs);
  } catch (err: any) {
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
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
    const captainStatus = await isCaptain(Number(claims.sub), teamId);

    if (!captainStatus) {
      return NextResponse.json(
        { error: "Samo kapiten tima može dodati članove" },
        { status: 403 },
      );
    }

    await db.update(users).set({ teamId }).where(eq(users.id, userId));
    await db
      .delete(teamJoinRequests)
      .where(eq(teamJoinRequests.userId, userId));
    return NextResponse.json(
      { message: "Korisnik dodat u tim" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating team membership:", error);
    return NextResponse.json(
      { error: "Greška pri ažuriranju članstva" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();

  const { userReqId, teamReqId } = body;
  console.log(
    "Received DELETE request with userReqId:",
    userReqId,
    "and teamReqId:",
    teamReqId,
  );

  if (!userReqId) {
    return NextResponse.json(
      { error: "User ID nije pronađen" },
      { status: 400 },
    );
  }

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
    const captainStatus = await isCaptain(
      Number(claims.sub),
      parseInt(teamReqId),
    );

    if (!captainStatus) {
      return NextResponse.json(
        { error: "Samo kapiten tima može odbiti zahtev" },
        { status: 403 },
      );
    }

    await db
      .delete(teamJoinRequests)
      .where(
        and(
          eq(teamJoinRequests.userId, parseInt(userReqId)),
          eq(teamJoinRequests.teamId, parseInt(teamReqId)),
        ),
      );
    return NextResponse.json({ message: "Zahtev odbijen" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting team join request:", error);
    return NextResponse.json(
      { error: "Greška pri brisanju zahteva" },
      { status: 500 },
    );
  }
}