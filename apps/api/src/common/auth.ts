import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "./env";
import { HTTPError } from "./http";
import { getPrisma } from "../db";

const SECRET = env.JWT_SECRET || "dev-secret";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  tenant: string;
}

export function signToken(user: AuthUser) {
  return jwt.sign(user, SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): AuthUser {
  return jwt.verify(token, SECRET) as AuthUser;
}

export async function authenticate(token?: string): Promise<AuthUser | null> {
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function login(tenant: string, email: string, password: string) {
  const prisma = getPrisma(tenant);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) throw new HTTPError(401, "Invalid credentials");
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new HTTPError(401, "Invalid credentials");
  return signToken({ id: user.id, email: user.email, role: user.role, tenant });
}
