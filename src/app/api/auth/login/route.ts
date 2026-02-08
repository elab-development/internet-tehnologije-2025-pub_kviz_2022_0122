import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signAuthToken, cookieOpts, AUTH_COOKIE } from "@/lib/auth";

type Body = {
    email: string;
    password: string;
}   

export async function POST(req: Request) {
    const { email, password } = (await req.json()) as Body;

    if (!email || !password) {
        return NextResponse.json({ error: "Pogesan email ili lozinka" }, { status: 401 })
    }

    const [u] = await db.select().from(users).where(eq(users.email, email));
    if (!u) {
        return NextResponse.json({ error: "Pogesan email ili lozinka" }, { status: 401 })
    }

    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) {
        return NextResponse.json({ error: "Pogesan email ili lozinka" }, { status: 401 })
    }

    const token = signAuthToken({ sub: u.id.toString(), email: u.email, name: u.name, role: u.role })
    const res = NextResponse.json({ id: u.id, name: u.name, email: u.email, role: u.role })
    res.cookies.set(AUTH_COOKIE, token, cookieOpts());
    return res;

}