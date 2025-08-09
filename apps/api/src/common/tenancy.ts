export interface TenantContext {
  tenant: string;
}

export function resolveTenant(headers: Record<string, string | undefined>): string {
  const header = headers["x-tenant"];
  if (header) return header;
  const host = headers["host"] || "";
  const [sub] = host.split(".");
  return sub || "public";
}
