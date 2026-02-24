import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";

type Body = {
    name: string;
    email: string;
    password: string;
}

export async function POST(req: Request) {
    const { name, email, password } = (await req.json()) as Body;

    if (!name || !email || !password) {
        return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 })
    }

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
