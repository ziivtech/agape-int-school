import { SignJWT, jwtVerify } from "jose";

// Edge-safe: used by middleware as well as route handlers.

export const SESSION_COOKIE = "aai_session";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

export type Role = "admin" | "editor" | "admissions";

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set to a random string of at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(session: Session): Promise<string> {
  return new SignJWT({ email: session.email, name: session.name, role: session.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function readSessionToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return {
      userId: payload.sub,
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

/* Which admin areas each role may use. */
export const ROLE_ACCESS: Record<Role, string[]> = {
  admin: ["dashboard", "content", "media", "news", "events", "alumni", "enquiries", "users"],
  editor: ["dashboard", "content", "media", "news", "events", "alumni"],
  admissions: ["dashboard", "enquiries"],
};

export function canAccess(role: Role, area: string): boolean {
  return ROLE_ACCESS[role]?.includes(area) ?? false;
}
