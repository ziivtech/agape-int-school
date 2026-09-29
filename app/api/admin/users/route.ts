import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { requireDb, schema } from "../../../../lib/db";
import { handle, HttpError, logActivity, requireArea } from "../../../../lib/auth/server";
import { hashPassword, validatePasswordStrength } from "../../../../lib/auth/password";

const ROLES = ["admin", "editor", "admissions"] as const;

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(ROLES),
  password: z.string().min(1),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(120).optional(),
  role: z.enum(ROLES).optional(),
  active: z.boolean().optional(),
  password: z.string().optional(),
});

async function activeAdminCount(excludeId: string) {
  const [{ count }] = await requireDb()
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.users)
    .where(and(eq(schema.users.role, "admin"), eq(schema.users.active, true), ne(schema.users.id, excludeId)));
  return count;
}

export const POST = handle(async (req: NextRequest) => {
  const session = await requireArea("users");
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Please check the details.");
  const weak = validatePasswordStrength(parsed.data.password);
  if (weak) throw new HttpError(400, weak);

  const db = requireDb();
  const [clash] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, parsed.data.email));
  if (clash) throw new HttpError(409, "Someone already uses that email address.");

  const [user] = await db
    .insert(schema.users)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      passwordHash: await hashPassword(parsed.data.password),
    })
    .returning({ id: schema.users.id, name: schema.users.name, email: schema.users.email, role: schema.users.role, active: schema.users.active });

  await logActivity(session.userId, "create", "user", user.id, `Added staff account for ${user.name} (${user.role})`);
  return NextResponse.json({ success: true, user });
});

export const PATCH = handle(async (req: NextRequest) => {
  const session = await requireArea("users");
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Please check the details.");
  const { id, password, ...changes } = parsed.data;

  // Never lock the school out of its own admin.
  const demoting = (changes.role && changes.role !== "admin") || changes.active === false;
  if (demoting && (await activeAdminCount(id)) === 0) {
    throw new HttpError(400, "There must always be at least one active admin.");
  }

  const set: Partial<typeof schema.users.$inferInsert> = { ...changes };
  if (password) {
    const weak = validatePasswordStrength(password);
    if (weak) throw new HttpError(400, weak);
    set.passwordHash = await hashPassword(password);
  }

  const [user] = await requireDb()
    .update(schema.users)
    .set(set)
    .where(eq(schema.users.id, id))
    .returning({ id: schema.users.id, name: schema.users.name, email: schema.users.email, role: schema.users.role, active: schema.users.active });
  if (!user) throw new HttpError(404, "Account not found.");

  const what = [changes.role && `role → ${changes.role}`, changes.active === false && "deactivated", changes.active === true && "reactivated", password && "password reset"]
    .filter(Boolean)
    .join(", ");
  await logActivity(session.userId, "update", "user", id, `Updated ${user.name}${what ? `: ${what}` : ""}`);
  return NextResponse.json({ success: true, user });
});
