import { describe, expect, it, vi } from "vitest";
import { isModuleAllowed, moduleForPath } from "@/lib/permissions";

function mockClient(row: { allowed?: boolean } | null, error: { message: string } | null = null) {
  const maybeSingle = vi.fn().mockResolvedValue({ data: row, error });
  const eq2 = vi.fn().mockReturnValue({ maybeSingle });
  const eq1 = vi.fn().mockReturnValue({ eq: eq2 });
  const select = vi.fn().mockReturnValue({ eq: eq1 });
  const from = vi.fn().mockReturnValue({ select });
  return { from, eq1, eq2, select };
}

describe("moduleForPath", () => {
  it("associe un chemin CRM au module crm", () => {
    expect(moduleForPath("/crm/contact-grid")).toBe("crm");
    expect(moduleForPath("/leads-list")).toBe("crm");
    expect(moduleForPath("/crm-setting/capture-forms")).toBe("crm");
  });

  it("prend le préfixe le plus long (dossiers avant CRM)", () => {
    expect(moduleForPath("/crm/projects")).toBe("projects");
    expect(moduleForPath("/crm/project-details/abc")).toBe("projects");
  });

  it("associe la paie et les utilisateurs", () => {
    expect(moduleForPath("/timesheets")).toBe("hrm-payroll");
    expect(moduleForPath("/user-management/permissions")).toBe("user-management");
  });

  it("laisse les pages hors registre sans module", () => {
    expect(moduleForPath("/dashboard")).toBeNull();
    expect(moduleForPath("/login")).toBeNull();
    expect(moduleForPath("/l/devis-visa")).toBeNull();
  });
});

describe("isModuleAllowed", () => {
  it("autorise toujours un rôle d'administration sans requête", async () => {
    const client = mockClient(null);
    await expect(isModuleAllowed(client as never, "admin", "hrm-payroll")).resolves.toBe(true);
    expect(client.from).not.toHaveBeenCalled();
  });

  it("refuse un rôle non-admin avec allowed:false", async () => {
    const client = mockClient({ allowed: false });
    await expect(isModuleAllowed(client as never, "staff", "hrm-payroll")).resolves.toBe(false);
    expect(client.from).toHaveBeenCalledWith("module_permissions");
  });

  it("autorise par défaut un rôle non-admin sans ligne", async () => {
    const client = mockClient(null);
    await expect(isModuleAllowed(client as never, "staff", "crm")).resolves.toBe(true);
  });

  it("refuse un utilisateur sans rôle", async () => {
    const client = mockClient({ allowed: true });
    await expect(isModuleAllowed(client as never, null, "crm")).resolves.toBe(false);
    expect(client.from).not.toHaveBeenCalled();
  });
});
