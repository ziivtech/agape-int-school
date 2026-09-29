import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "./server";
import { canAccess, Session } from "./session";
import { getDb, schema } from "../db";

/**
 * For admin server pages: returns the session, or redirects to the login
 * page (not signed in / deactivated) or the dashboard (wrong role).
 */
export async function requirePageArea(area: string): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const db = getDb();
  if (db) {
    const [user] = await db
      .select({ active: schema.users.active, role: schema.users.role, name: schema.users.name })
      .from(schema.users)
      .where(eq(schema.users.id, session.userId));
    if (!user || !user.active) redirect("/admin/login");
    session.role = user.role;
    session.name = user.name;
  }

  if (!canAccess(session.role, area)) redirect("/admin");
  return session;
}
