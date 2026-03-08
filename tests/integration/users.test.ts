import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import { createServer } from "http";
import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_COOKIE } from "@/lib/auth";
import { GET } from "@/app/api/users/route";

let cookieValue: string | undefined;

export function setMockCookie(value?: string) {
  cookieValue = value;
}

vi.mock("next/headers", () => {
  return {
    cookies: () => ({
      get: (name: string) => {
        if (name === AUTH_COOKIE && cookieValue) {
          return { value: cookieValue };
        }
        return undefined;
      },
    }),
  };
});

vi.mock("@/lib/auth", async () => {
  const actual = await vi.importActual<any>("@/lib/auth");
  return {
    ...actual,
    verifyAuthToken: vi.fn((token?: string) => {
      if (!token) return null;
      return {
        sub: "1",
        email: "test@example.com",
        role: "PLAYER",
        name: "Test User",
      };
    }),
  };
});

function makeServer() {
  return createServer(async (req, res) => {
    const url = new URL(req.url!, "http://localhost");
    const nextReq = { url: url.toString(), method: req.method } as any;
    const response = await GET(nextReq);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(await response.text());
  });
}

describe("Users API integration", () => {
  let server: ReturnType<typeof makeServer>;
  let userId: number;

  beforeAll(async () => {
    server = makeServer();
    await db.delete(users);
    const [inserted] = await db
      .insert(users)
      .values({
        name: "Test User",
        email: "test@example.com",
        passwordHash: "testhash",
        role: "PLAYER",
        createdAt: new Date(),
        teamId: null,
        captain: false,
      })
      .returning();
    userId = inserted.id;
  });

  afterAll(async () => {
    server.close();
    await db.$client.end();
  });

  it("vrati listu korisnika kada postoji token", async () => {
    setMockCookie("anyToken");
    const res = await request(server).get("/api/users");
    expect(res.status).toBe(200);
    expect(
      res.body.find((u: any) => u.email === "test@example.com"),
    ).toBeDefined();
  });

  it("vrati jednog korisnika kada se prosledi id", async () => {
    setMockCookie("anyToken");
    const res = await request(server).get(`/api/users?id=${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("test@example.com");
  });

  it("vrati 401 kada nema tokena", async () => {
    setMockCookie(undefined);
    const res = await request(server).get("/api/users");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Niste ulogovani");
  });
});
