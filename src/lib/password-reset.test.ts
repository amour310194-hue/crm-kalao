import { describe, expect, it } from "vitest";
import {
  MAX_RESET_ATTEMPTS,
  MIN_PASSWORD_LENGTH,
  RESET_FAIL_MESSAGE,
  RESET_TTL_MS,
  ResetError,
  assertNewPassword,
  consumePasswordResetWithStore,
  hashSecret,
  issuePasswordResetWithStore,
  type ResetRow,
  type ResetStore,
} from "@/lib/password-reset";

function memoryResetStore(seed?: Partial<ResetRow>[]): ResetStore & { rows: ResetRow[]; passwords: Map<string, string>; signOuts: string[] } {
  const rows: ResetRow[] = (seed ?? []).map((row) => ({
    id: row.id ?? "r1",
    user_id: row.user_id ?? "u1",
    email: row.email ?? "amour@groupe-kalao.com",
    code_hash: row.code_hash ?? hashSecret("123456"),
    token_hash: row.token_hash ?? hashSecret("tokentoken"),
    expires_at: row.expires_at ?? new Date(Date.now() + RESET_TTL_MS).toISOString(),
    used_at: row.used_at ?? null,
    attempts: row.attempts ?? 0,
  }));
  const passwords = new Map<string, string>();
  const signOuts: string[] = [];
  const store: ResetStore & { rows: ResetRow[]; passwords: Map<string, string>; signOuts: string[] } = {
    rows,
    passwords,
    signOuts,
    async lookupUserIdByEmail(email) {
      return email === "amour@groupe-kalao.com" ? "u1" : null;
    },
    async deleteUnusedForEmail(email) {
      for (let i = rows.length - 1; i >= 0; i--) {
        if (rows[i].email === email && !rows[i].used_at) rows.splice(i, 1);
      }
    },
    async insert(row) {
      rows.push({
        id: `r${rows.length + 1}`,
        user_id: row.user_id,
        email: row.email,
        code_hash: row.code_hash,
        token_hash: row.token_hash,
        expires_at: row.expires_at,
        used_at: null,
        attempts: 0,
      });
    },
    async findUnusedByEmail(email) {
      return rows.find((r) => r.email === email && !r.used_at) ?? null;
    },
    async findUnusedByTokenHash(tokenHash) {
      return rows.find((r) => r.token_hash === tokenHash && !r.used_at) ?? null;
    },
    async incrementAttempts(id) {
      const row = rows.find((r) => r.id === id);
      if (!row) return 0;
      row.attempts += 1;
      return row.attempts;
    },
    async invalidate(id) {
      const row = rows.find((r) => r.id === id);
      if (row) row.used_at = new Date().toISOString();
    },
    async markUsed(id) {
      const row = rows.find((r) => r.id === id);
      if (row) row.used_at = new Date().toISOString();
    },
    async updateUserPassword(userId, password) {
      passwords.set(userId, password);
    },
    async signOutAllSessions(userId) {
      signOuts.push(userId);
    },
  };
  return store;
}

describe("assertNewPassword", () => {
  it("refuse un mot de passe trop court", () => {
    expect(() => assertNewPassword("short", "a@b.c")).toThrow(ResetError);
  });
  it("refuse un mot de passe égal à l'e-mail", () => {
    const email = "contact@groupe-kalao.com";
    expect(() => assertNewPassword(email, email)).toThrow(/identique/i);
  });
  it(`accepte ${MIN_PASSWORD_LENGTH} caractères distincts de l'e-mail`, () => {
    expect(() => assertNewPassword("MotDePasse12!", "a@b.c")).not.toThrow();
  });
});

describe("consumePasswordResetWithStore", () => {
  it("refuse un code sans e-mail", async () => {
    const store = memoryResetStore();
    await expect(
      consumePasswordResetWithStore(store, { code: "123456", password: "MotDePasse12!" })
    ).rejects.toThrow(RESET_FAIL_MESSAGE);
  });

  it("refuse un code expiré", async () => {
    const store = memoryResetStore([
      {
        expires_at: new Date(Date.now() - 1000).toISOString(),
        code_hash: hashSecret("654321"),
      },
    ]);
    await expect(
      consumePasswordResetWithStore(store, {
        email: "amour@groupe-kalao.com",
        code: "654321",
        password: "MotDePasse12!",
      })
    ).rejects.toThrow(RESET_FAIL_MESSAGE);
    expect(store.passwords.size).toBe(0);
  });

  it("invalide la demande après 6 codes faux consécutifs", async () => {
    const store = memoryResetStore([{ code_hash: hashSecret("000000") }]);
    for (let i = 0; i < 6; i++) {
      await expect(
        consumePasswordResetWithStore(store, {
          email: "amour@groupe-kalao.com",
          code: "111111",
          password: "MotDePasse12!",
        })
      ).rejects.toThrow(RESET_FAIL_MESSAGE);
    }
    expect(store.rows[0].attempts).toBe(MAX_RESET_ATTEMPTS);
    expect(store.rows[0].used_at).not.toBeNull();
    expect(store.passwords.size).toBe(0);
  });

  it("accepte le bon code et ferme les sessions", async () => {
    const store = memoryResetStore([{ code_hash: hashSecret("424242") }]);
    await consumePasswordResetWithStore(store, {
      email: "amour@groupe-kalao.com",
      code: "424242",
      password: "MotDePasse12!",
    });
    expect(store.passwords.get("u1")).toBe("MotDePasse12!");
    expect(store.signOuts).toEqual(["u1"]);
    expect(store.rows[0].used_at).not.toBeNull();
  });
});

describe("issuePasswordResetWithStore", () => {
  it("remplace les demandes inutilisées et expire en 15 minutes", async () => {
    const store = memoryResetStore([{ email: "amour@groupe-kalao.com" }]);
    const before = Date.now();
    const issued = await issuePasswordResetWithStore(store, "amour@groupe-kalao.com", "u1", {
      sendEmail: false,
    });
    expect(issued.code).toHaveLength(6);
    expect(store.rows).toHaveLength(1);
    const exp = new Date(store.rows[0].expires_at).getTime();
    expect(exp).toBeGreaterThan(before + RESET_TTL_MS - 2000);
    expect(exp).toBeLessThanOrEqual(before + RESET_TTL_MS + 2000);
  });
});
