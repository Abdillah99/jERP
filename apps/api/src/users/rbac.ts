export type Permission =
  | "user:manage"
  | "product:manage"
  | "invoice:manage"
  | "report:view";

const rolePermissions: Record<string, Permission[] | ["*"]> = {
  OWNER: ["*"],
  ADMIN: ["user:manage", "product:manage", "invoice:manage", "report:view"],
  STAFF: ["product:manage", "invoice:manage", "report:view"],
};

export function hasPermission(role: string, perm: Permission) {
  const perms = rolePermissions[role] || [];
  return (perms as string[]).includes("*") || perms.includes(perm);
}
