import { api } from "encore.dev";
import { z } from "zod";
import { getPrisma } from "../db";
import { resolveTenant } from "../common/tenancy";
import { authenticate } from "../common/auth";
import { HTTPError } from "../common/http";
import { hasPermission } from "../users/rbac";
import { invoicePosted } from "../common/events";

const lineSchema = z.object({
  productId: z.string(),
  qty: z.number(),
  unitPrice: z.number(),
});

const invoiceSchema = z.object({
  customer: z.string(),
  lines: z.array(lineSchema),
});

export const listInvoices = api({ path: "/api/sales/invoices", method: "GET" }, async (req) => {
  const tenant = resolveTenant(req.headers as any);
  const prisma = getPrisma(tenant);
  return prisma.invoice.findMany({ include: { lines: true } });
});

export const createInvoice = api({ path: "/api/sales/invoices", method: "POST" }, async (req) => {
  const tenant = resolveTenant(req.headers as any);
  const auth = await authenticate(req.headers.authorization?.split(" ")[1]);
  if (!auth || !hasPermission(auth.role, "invoice:manage")) throw new HTTPError(403, "Forbidden");
  const data = invoiceSchema.parse(req.body);
  const subtotal = data.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const prisma = getPrisma(tenant);
  const invoice = await prisma.invoice.create({
    data: {
      customer: data.customer,
      subtotal,
      tax,
      total,
      lines: { create: data.lines.map(l => ({ ...l, total: l.qty * l.unitPrice })) },
    },
    include: { lines: true },
  });
  return invoice;
});

export const postInvoice = api({ path: "/api/sales/invoices/:id/post", method: "POST" }, async (req) => {
  const tenant = resolveTenant(req.headers as any);
  const auth = await authenticate(req.headers.authorization?.split(" ")[1]);
  if (!auth || !hasPermission(auth.role, "invoice:manage")) throw new HTTPError(403, "Forbidden");
  const prisma = getPrisma(tenant);
  const invoice = await prisma.invoice.update({
    where: { id: req.param.id },
    data: { status: "POSTED", postedAt: new Date() },
  });
  await invoicePosted.publish({ invoiceId: invoice.id, tenant });
  return invoice;
});
