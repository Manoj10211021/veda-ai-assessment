export const DEFAULT_GEMINI_TIMEOUT_MS = 120000;
export const PER_IMAGE_TIMEOUT_MS = 15000;
export const MAX_GEMINI_TIMEOUT_MS = 300000;

export function getGeminiTimeoutMs(imageCount: number): number {
  const count = Math.max(0, Number.isFinite(imageCount) ? imageCount : 0);
  const extra = Math.max(0, count - 1) * PER_IMAGE_TIMEOUT_MS;
  return Math.min(MAX_GEMINI_TIMEOUT_MS, DEFAULT_GEMINI_TIMEOUT_MS + extra);
}
