import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireDb, schema } from "../../../../lib/db";
import { handle, HttpError, logActivity, requireArea } from "../../../../lib/auth/server";
import { hashPassword, validatePasswordStrength, verifyPassword } from "../../../../lib/auth/password";

/** Change your own password. */
export const PATCH = handle(async (req: NextRequest) => {
  const session = await requireArea("dashboard");
  const { currentPassword, newPassword } = await req.json();
  if (typeof currentPassword !== "string" || typeof newPassword !== "string") throw new HttpError(400, "Fill in both passwords.");

  const weak = validatePasswordStrength(newPassword);
  if (weak) throw new HttpError(400, weak);

  const db = requireDb();
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, session.userId));
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    throw new HttpError(400, "Your current password is incorrect.");
  }

  await db.update(schema.users).set({ passwordHash: await hashPassword(newPassword) }).where(eq(schema.users.id, user.id));
  await logActivity(user.id, "update", "user", user.id, "Changed their password");
  return NextResponse.json({ success: true });
});
