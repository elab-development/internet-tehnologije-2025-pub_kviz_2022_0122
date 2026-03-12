import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Obriši korisnika
 *     description: Sam korisnik ili admin mogu obrisati korisnika.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID korisnika koji se briše
 *     responses:
 *       200:
 *         description: Korisnik uspešno obrisan
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       401:
 *         description: Niste ulogovani ili token nevalidan
 *         content:
 *           application/json:
 *             example:
 *               error: Niste ulogovani
 *       403:
 *         description: Nemate dozvolu za ovu akciju
 *         content:
 *           application/json:
 *             example:
 *               error: Nemate dozvolu za ovu akciju
 *       500:
 *         description: Greška na serveru
 *         content:
 *           application/json:
 *             example:
 *               error: Greška na serveru
 *     security:
 *       - cookieAuth: []
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    }

    let claims;
    try {
      claims = verifyAuthToken(token);
    } catch {
      return NextResponse.json(
        { error: "Token je istekao ili je nevalidan" },
        { status: 401 },
      );
    }

    const userId = parseInt((await params).userId, 10);

    const isOwnProfile = parseInt(claims.sub) == userId;
    const isAdmin = claims.role === "ADMIN";

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json(
        { error: "Nemate dozvolu za ovu akciju" },
        { status: 403 },
      );
    }

    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: Ažuriraj korisnika
 *     description: Sam korisnik ili admin mogu ažurirati korisnika.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID korisnika koji se ažurira
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Novi email korisnika
 *               name:
 *                 type: string
 *                 description: Novo ime korisnika
 *               role:
 *                 type: string
 *                 description: Nova uloga (samo admin može menjati)
 *     responses:
 *       200:
 *         description: Korisnik uspešno ažuriran
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       400:
 *         description: Nevalidan userId
 *         content:
 *           application/json:
 *             example:
 *               error: Nevalidan userId
 *       401:
 *         description: Niste ulogovani ili token nevalidan
 *         content:
 *           application/json:
 *             example:
 *               error: Niste ulogovani
 *       403:
 *         description: Nemate dozvolu za ovu akciju
 *         content:
 *           application/json:
 *             example:
 *               error: Nemate dozvolu za ovu akciju
 *       500:
 *         description: Greška na serveru
 *         content:
 *           application/json:
 *             example:
 *               error: Greška na serveru
 *     security:
 *       - cookieAuth: []
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    }

    let claims;
    try {
      claims = verifyAuthToken(token);
    } catch {
      return NextResponse.json(
        { error: "Token je istekao ili je nevalidan" },
        { status: 401 },
      );
    }

    const userId = parseInt((await params).userId, 10);

    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "Nevalidan userId" }, { status: 400 });
    }
    const isOwnProfile = parseInt(claims.sub) == userId;
    const isAdmin = claims.role === "ADMIN";

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json(
        { error: "Nemate dozvolu za ovu akciju" },
        { status: 403 },
      );
    }

    const body = await req.json();

    const { email, name, role } = body;

    const updateData: any = {};

    if (email) updateData.email = email;
    if (name) updateData.name = name;

    if (role && isAdmin) {
      updateData.role = role;
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}
