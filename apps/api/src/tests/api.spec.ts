import { describe, it, expect } from "vitest";
import { resolveTenant } from "../common/tenancy";
import { hasPermission } from "../users/rbac";

describe("tenancy", () => {
  it("resolves tenant from header", () => {
    expect(resolveTenant({ "x-tenant": "acme", host: "" })).toBe("acme");
  });
});

describe("rbac", () => {
  it("owner has all permissions", () => {
    expect(hasPermission("OWNER", "user:manage")).toBe(true);
  });
});
