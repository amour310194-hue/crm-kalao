const TOKEN_RE = /^CXN-\d{8}-[0-9A-F]{8}$/;

export function issueLoginToken(now = new Date()): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const rand = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Douala" }).format(now).replace(/-/g, "");
  return `CXN-${day}-${rand}`;
}

export function isLoginToken(value: string): boolean {
  return TOKEN_RE.test(value.trim().toUpperCase());
}
