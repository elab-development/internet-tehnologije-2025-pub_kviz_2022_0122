import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(1, "Ime je obavezno").max(100, "Ime je predugačko"),
    email: z.string().email("Neispravan format email adrese"),
    password: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera"),
});

export async function POST(req: Request) {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json({ error: "Neispravni podaci", details: result.error.flatten() }, { status: 400 });
    }

    const { name, email, password } = result.data;

    const exists = await db.select().from(users).where(eq(users.email, email));
    if (exists.length) {
        return NextResponse.json({ error: "Email postoji u bazi" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [u] = await db.insert(users)
        .values({ name, email, passwordHash, role: "PLAYER" })
        .returning({ id: users.id, name: users.name, email: users.email })


    const token = signAuthToken({ sub: u.id.toString(), email: u.email, name: u.name })
    const res = NextResponse.json(u)
    res.cookies.set(AUTH_COOKIE, token, cookieOpts());
    return res;

}
