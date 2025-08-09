import { api } from "encore.dev";
import { z } from "zod";
import { getPrisma } from "../db";
import { resolveTenant } from "../common/tenancy";
import { authenticate } from "../common/auth";
import { HTTPError } from "../common/http";
import { hasPermission } from "../users/rbac";
import { productCreated, productUpdated } from "../common/events";

const productSchema = z.object({
  sku: z.string(),
  name: z.string(),
  uom: z.string(),
  price: z.number(),
  active: z.boolean().default(true),
});

export const listProducts = api({ path: "/api/catalog/products", method: "GET" }, async (req) => {
  const tenant = resolveTenant(req.headers as any);
  const prisma = getPrisma(tenant);
  return prisma.product.findMany();
});

export const createProduct = api({ path: "/api/catalog/products", method: "POST" }, async (req) => {
  const tenant = resolveTenant(req.headers as any);
  const auth = await authenticate(req.headers.authorization?.split(" ")[1]);
  if (!auth || !hasPermission(auth.role, "product:manage")) throw new HTTPError(403, "Forbidden");
  const data = productSchema.parse(req.body);
  const prisma = getPrisma(tenant);
  const product = await prisma.product.create({ data });
  await productCreated.publish({ id: product.id, tenant });
  return product;
});

export const updateProduct = api({ path: "/api/catalog/products/:id", method: "PUT" }, async (req) => {
  const tenant = resolveTenant(req.headers as any);
  const auth = await authenticate(req.headers.authorization?.split(" ")[1]);
  if (!auth || !hasPermission(auth.role, "product:manage")) throw new HTTPError(403, "Forbidden");
  const data = productSchema.partial().parse(req.body);
  const prisma = getPrisma(tenant);
  const product = await prisma.product.update({ where: { id: req.param.id }, data });
  await productUpdated.publish({ id: product.id, tenant });
  return product;
});
