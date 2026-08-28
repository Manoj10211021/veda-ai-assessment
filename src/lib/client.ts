export function getUserApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("veda_gemini_api_key") ?? "";
}

export function setUserApiKey(key: string) {
  if (typeof window === "undefined") return;
  if (key.trim()) {
    localStorage.setItem("veda_gemini_api_key", key.trim());
  } else {
    localStorage.removeItem("veda_gemini_api_key");
  }
}

export async function postJSON<T = any>(url: string, body: unknown): Promise<T> {
  const userKey = getUserApiKey();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (userKey) headers["x-user-api-key"] = userKey;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any)?.error ?? `Request failed (${res.status})`);
  return data as T;
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function fmtSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  return `${Math.max(1, Math.round(bytes / 1024))}KB`;
}

export function fmtNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
