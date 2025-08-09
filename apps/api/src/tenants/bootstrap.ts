import { execSync } from "child_process";
import { env } from "../common/env";
import { basePrisma } from "../db";

export async function bootstrapTenant(schema: string) {
  await basePrisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
  execSync(`DATABASE_URL=${env.DATABASE_URL}?schema=${schema} npx prisma migrate deploy`, {
    stdio: "inherit",
    cwd: process.cwd(),
  });
}
