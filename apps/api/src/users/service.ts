import { api } from "encore.dev";
import bcrypt from "bcryptjs";
import { createUserSchema } from "./model";
import { signToken, authenticate, login as loginUser } from "../common/auth";
import { resolveTenant } from "../common/tenancy";
import { getPrisma } from "../db";
import { hasPermission } from "./rbac";
import { HTTPError } from "../common/http";

export const register = api({ path: "/api/auth/register", method: "POST" }, async (req) => {
  const tenant = resolveTenant(req.headers as any);
  const data = createUserSchema.parse(req.body);
  const prisma = getPrisma(tenant);
  const hashed = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({ data: { ...data, password: hashed } });
  const token = signToken({ id: user.id, email: user.email, role: user.role, tenant });
  return { token };
});

export const login = api({ path: "/api/auth/login", method: "POST" }, async (req) => {
  const tenant = resolveTenant(req.headers as any);
  const { email, password } = req.body as { email: string; password: string };
  const token = await loginUser(tenant, email, password);
  return { token };
});

export const me = api({ path: "/api/auth/me", method: "GET" }, async (req) => {
  const auth = await authenticate(req.headers.authorization?.split(" ")[1]);
  if (!auth) throw new HTTPError(401, "Unauthorized");
  return auth;
});

export const listUsers = api({ path: "/api/users", method: "GET" }, async (req) => {
  const auth = await authenticate(req.headers.authorization?.split(" ")[1]);
  if (!auth) throw new HTTPError(401, "Unauthorized");
  if (!hasPermission(auth.role, "user:manage")) throw new HTTPError(403, "Forbidden");
  const prisma = getPrisma(auth.tenant);
  return prisma.user.findMany();
});
