import { test, expect } from "@playwright/test";
import { mustEnrollMfa } from "../src/lib/authz";

test("un compte direction sans aal2 ne peut pas rester sur le CRM", () => {
  expect(mustEnrollMfa("direction", "aal1")).toBe(true);
  expect(mustEnrollMfa("direction", "aal2")).toBe(false);
});
