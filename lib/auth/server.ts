import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { SESSION_COOKIE, readSessionToken, canAccess, Session } from "./session";
import { getDb, schema } from "../db";

export async function getSession(): Promise<Session | null> {
  return readSessionToken(cookies().get(SESSION_COOKIE)?.value);
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/**
 * Resolves the signed-in staff member and checks they may use `area`.
 * Also re-checks the database so a deactivated account loses access immediately.
 */
export async function requireArea(area: string): Promise<Session> {
  const session = await getSession();
  if (!session) throw new HttpError(401, "Please sign in.");
  if (!canAccess(session.role, area)) throw new HttpError(403, "Your role does not have access to this area.");

  const db = getDb();
  if (db) {
    const [user] = await db
      .select({ active: schema.users.active, role: schema.users.role })
      .from(schema.users)
      .where(eq(schema.users.id, session.userId));
    if (!user || !user.active) throw new HttpError(401, "This account has been deactivated.");
    if (!canAccess(user.role, area)) throw new HttpError(403, "Your role does not have access to this area.");
    session.role = user.role;
  }
  return session;
}

/** Wraps a route handler so thrown HttpErrors become JSON responses. */
export function handle<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err instanceof HttpError) {
        return NextResponse.json({ success: false, error: err.message }, { status: err.status });
      }
      console.error(err);
      const message = err instanceof Error ? err.message : "Something went wrong.";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  };
}

export async function logActivity(
  userId: string | null,
  action: string,
  entity: string,
  entityId?: string | null,
  summary?: string
) {
  const db = getDb();
  if (!db) return;
  try {
    await db.insert(schema.activityLog).values({ userId, action, entity, entityId: entityId ?? null, summary });
  } catch (err) {
    console.error("activity log failed", err);
  }
}
