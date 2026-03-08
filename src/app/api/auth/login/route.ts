import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signAuthToken, cookieOpts, AUTH_COOKIE } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Neispravan format email adrese"),
  password: z.string().min(1, "Lozinka je obavezna"),
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Prijava korisnika
 *     description: Autentifikuje korisnika i vraća JWT token u cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Uspešna prijava
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Neispravni podaci
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Pogrešan email ili lozinka
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: Request) {
  const body = await req.json();
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Pogesan email ili lozinka", details: result.error.flatten() },
      { status: 400 },
    );
  }

  const { email, password } = result.data;

  const [u] = await db.select().from(users).where(eq(users.email, email));
  if (!u) {
    return NextResponse.json(
      { error: "Pogesan email ili lozinka" },
      { status: 401 },
    );
  }

  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "Pogesan email ili lozinka" },
      { status: 401 },
    );
  }

  const token = signAuthToken({
    sub: u.id.toString(),
    email: u.email,
    name: u.name,
    role: u.role,
  });
  const res = NextResponse.json({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
  });
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());
  return res;
}
