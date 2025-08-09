import { api } from "encore.dev";
import { bootstrapTenant } from "./bootstrap";
import { basePrisma } from "../db";
import { HTTPError } from "../common/http";

export const createTenant = api({ path: "/api/tenants", method: "POST" }, async (req) => {
  const { name, schema } = req.body as { name: string; schema: string };
  if (!name || !schema) throw new HTTPError(400, "Invalid payload");
  const tenant = await basePrisma.tenant.create({ data: { name, schema } });
  await bootstrapTenant(schema);
  return tenant;
});
