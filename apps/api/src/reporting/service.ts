import { api } from "encore.dev";
import { getPrisma } from "../db";
import { resolveTenant } from "../common/tenancy";
import { z } from "zod";
import { exportRequested } from "./workers";

export const salesSummary = api({ path: "/api/reporting/sales-summary", method: "GET" }, async (req) => {
  const tenant = resolveTenant(req.headers as any);
  const querySchema = z.object({ from: z.string(), to: z.string() });
  const { from, to } = querySchema.parse(req.query);
  const prisma = getPrisma(tenant);
  const rows = await prisma.$queryRawUnsafe(`
    SELECT date_trunc('day', "postedAt") as day, sum(total) as total
    FROM "Invoice"
    WHERE "postedAt" BETWEEN '${from}' AND '${to}'
    GROUP BY day ORDER BY day;
  `);
  return rows as any;
});

export const exportSales = api({ path: "/api/reporting/export", method: "POST" }, async (req) => {
  const tenant = resolveTenant(req.headers as any);
  const jobId = Date.now().toString();
  await exportRequested.publish({ tenant, jobId });
  return { jobId };
});
