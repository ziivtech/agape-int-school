import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { requireDb, schema } from "../../../../lib/db";
import { hashPassword, verifyPassword } from "../../../../lib/auth/password";
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from "../../../../lib/auth/session";
import { getSession, handle, logActivity } from "../../../../lib/auth/server";

// Best-effort brute-force brake. Serverless instances don't share memory,
// so this slows attackers down rather than stopping them outright.
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 8;
const LOCK_MS = 15 * 60 * 1000;

function clientKey(req: NextRequest, email: string) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  return `${ip}:${email}`;
}

/**
 * First-run bootstrap: when there are no staff accounts yet, signing in with
 * ADMIN_EMAIL / ADMIN_PASSWORD from the environment creates the first admin.
 */
async function bootstrapFirstAdmin(email: string, password: string) {
  const db = requireDb();
  const envEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envEmail || !envPassword || email !== envEmail || password !== envPassword) return null;

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(schema.users);
  if (count > 0) return null;

  const [user] = await db
    .insert(schema.users)
    .values({ email, name: "Administrator", role: "admin", passwordHash: await hashPassword(password) })
    .returning();
  return user;
}

export const POST = handle(async (req: NextRequest) => {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").toLowerCase().trim();
  const password = String(body.password || "");
  if (!email || !password) {
    return NextResponse.json({ success: false, error: "Enter your email and password." }, { status: 400 });
  }

  const key = clientKey(req, email);
  const record = attempts.get(key);
  if (record && record.count >= MAX_ATTEMPTS && record.until > Date.now()) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  const db = requireDb();
  let [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
  if (!user) user = (await bootstrapFirstAdmin(email, password)) ?? user;

  const valid = user && user.active && (await verifyPassword(password, user.passwordHash));
  if (!valid) {
    const next = record && record.until > Date.now() ? record.count + 1 : 1;
    attempts.set(key, { count: next, until: Date.now() + LOCK_MS });
    return NextResponse.json({ success: false, error: "Incorrect email or password." }, { status: 401 });
  }

  attempts.delete(key);
  await db.update(schema.users).set({ lastLoginAt: new Date() }).where(eq(schema.users.id, user.id));
  await logActivity(user.id, "login", "user", user.id);

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const res = NextResponse.json({ success: true, user: { name: user.name, role: user.role } });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
});

export const GET = handle(async () => {
  const session = await getSession();
  return NextResponse.json({ authenticated: Boolean(session), user: session });
});

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
