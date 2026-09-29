import { asc } from "drizzle-orm";
import { requirePageArea } from "@/lib/auth/page";
import { requireDb, schema } from "@/lib/db";
import UsersManager from "@/components/admin/UsersManager";

export default async function UsersPage() {
  const session = await requirePageArea("users");
  const users = await requireDb()
    .select({
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      role: schema.users.role,
      active: schema.users.active,
      lastLoginAt: schema.users.lastLoginAt,
    })
    .from(schema.users)
    .orderBy(asc(schema.users.name));

  return (
    <UsersManager
      currentUserId={session.userId}
      initial={users.map((u) => ({ ...u, lastLoginAt: u.lastLoginAt?.toISOString() ?? null }))}
    />
  );
}
