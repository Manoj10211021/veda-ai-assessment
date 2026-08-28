export function normLabel(raw: string): string {
  const s = (raw ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return s.startsWith("q") && s.length > 1 && /[0-9]/.test(s[1]) ? s.slice(1) : s;
}

export function toNumOrNull(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

export function clampNum(v: unknown, min: number, max: number): number | null {
  const n = toNumOrNull(v);
  if (n === null) return null;
  return Math.min(max, Math.max(min, n));
}

export function sanitizeBox(b: unknown): [number, number, number, number] | null {
  if (!Array.isArray(b) || b.length !== 4) return null;
  const nums = b.map(Number);
  if (nums.some((n) => !Number.isFinite(n))) return null;
  let [ymin, xmin, ymax, xmax] = nums;
  if (ymax < ymin) [ymin, ymax] = [ymax, ymin];
  if (xmax < xmin) [xmin, xmax] = [xmax, xmin];
  const cl = (n: number) => Math.min(1000, Math.max(0, n));
  ymin = cl(ymin);
  xmin = cl(xmin);
  ymax = cl(ymax);
  xmax = cl(xmax);
  if (ymax - ymin < 5 || xmax - xmin < 5) return null;
  return [ymin, xmin, ymax, xmax];
}
