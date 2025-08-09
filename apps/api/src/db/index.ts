import { PrismaClient } from "@prisma/client";
import { env } from "../common/env";

const clients = new Map<string, PrismaClient>();

export function getPrisma(tenant: string) {
  if (!clients.has(tenant)) {
    const url = new URL(env.DATABASE_URL);
    url.searchParams.set("schema", tenant);
    const client = new PrismaClient({ datasources: { db: { url: url.toString() } } });
    clients.set(tenant, client);
  }
  return clients.get(tenant)!;
}

export const basePrisma = new PrismaClient({ datasources: { db: { url: env.DATABASE_URL } } });
