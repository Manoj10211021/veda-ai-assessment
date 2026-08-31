import { NextResponse } from "next/server";
import { getGeminiTimeoutMs } from "./gemini-timeout";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type GeminiPart =
  | { text: string }
  | { inline_data: { mime_type: string; data: string } };

function stripDataUrl(dataUrl: string): { mime: string; data: string } {
  const m = /^data:([^;]+);base64,(.*)$/s.exec(dataUrl);
  if (!m) throw new HttpError(400, "Invalid image payload");
  return { mime: m[1], data: m[2] };
}

export function parseJsonLoose(text: string): unknown {
  let t = text.trim();
  t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  try {
    return JSON.parse(t);
  } catch {}
  const s = t.indexOf("{");
  const e = t.lastIndexOf("}");
  if (s !== -1 && e > s) {
    const slice = t.slice(s, e + 1);
    try {
      const parsed = JSON.parse(slice);
      // The full string didn't parse as JSON on its own, but this slice did.
      // That means there was trailing content after the last "}" — almost
      // always a sign the model's output was cut off mid-stream and what we
      // recovered is only a prefix of the intended data (e.g. the first few
      // segments of an array, with the rest missing). Surface this instead
      // of silently returning a partial result that looks complete.
      const trailing = t.slice(e + 1).trim();
      if (trailing.length > 0) {
        console.error(
          "[Gemini JSON Parse Warning] Recovered a partial/truncated object. Trailing content:",
          trailing.slice(0, 200),
        );
        throw new HttpError(
          502,
          "The AI response appears to have been cut off partway through. Please retry (try fewer items per batch if this keeps happening).",
        );
      }
      return parsed;
    } catch (err) {
      if (err instanceof HttpError) throw err;
    }
  }
  console.error(`[Gemini JSON Parse Error] Raw text was:`, text);
  throw new HttpError(
    502,
    "AI returned an unparseable response. Please retry.",
  );
}

export function getGeminiModelCandidates(configuredModel?: string): string[] {
  const seeded = [
    configuredModel,
    "gemini-3.6-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro",
  ]
    .map((m) => (typeof m === "string" ? m.trim() : ""))
    .filter(Boolean);

  return [...new Set(seeded)];
}

export async function geminiJSON(opts: {
  prompt: string;
  images?: string[];
  thinkingBudget?: number;
  userKey?: string;
}): Promise<any> {
  const key = opts.userKey || process.env.GEMINI_API_KEY;
  if (!key)
    throw new HttpError(
      500,
      "GEMINI_API_KEY is not configured. Add it to .env.local for local dev, or set it in Vercel Project Settings > Environment Variables and redeploy. You can also enter your own key in Settings.",
    );

  const models = getGeminiModelCandidates(process.env.GEMINI_MODEL);
  const timeoutMs = getGeminiTimeoutMs((opts.images ?? []).length);

  const parts: GeminiPart[] = (opts.images ?? []).map((d) => {
    const { mime, data } = stripDataUrl(d);
    return { inline_data: { mime_type: mime, data } };
  });
  parts.push({ text: opts.prompt });

  const generationConfig: Record<string, unknown> = {
    temperature: 0.2,
    responseMimeType: "application/json",
    maxOutputTokens: 65536,
  };
  if (opts.thinkingBudget !== undefined && opts.thinkingBudget > 0) {
    generationConfig.thinkingConfig = { thinkingBudget: opts.thinkingBudget };
  }

  let lastError: HttpError | null = null;

  for (const model of models) {
    let res: Response | null = null;
    try {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": key,
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts }],
            generationConfig,
          }),
          signal: AbortSignal.timeout(timeoutMs),
        },
      );
    } catch (err) {
      console.error(`[Gemini Fetch Timeout/Network Error for ${model}]:`, err);
      lastError = new HttpError(
        504,
        "The AI request timed out. Try again with fewer pages.",
      );
      continue;
    }

    if (!res.ok) {
      let msg = String(res.status);
      try {
        const j = await res.json();
        msg = j?.error?.message ?? msg;
      } catch {}
      console.error(`[Gemini API Error ${res.status} on ${model}]:`, msg);

      if (res.status === 429 || res.status === 503 || res.status === 500) {
        lastError = new HttpError(res.status, `Gemini API error: ${msg}`);
        continue;
      }

      if (
        res.status === 400 &&
        msg.includes("not found") &&
        model !== models.at(-1)
      ) {
        lastError = new HttpError(502, `Gemini API error: ${msg}`);
        continue;
      }

      throw new HttpError(502, `Gemini API error: ${msg}`);
    }

    try {
      const data = await res.json();
      const cand = data?.candidates?.[0];
      const text: string = (cand?.content?.parts ?? [])
        .map((p: any) => p?.text ?? "")
        .join("");
      if (!text) {
        console.error(
          "[Gemini Empty Response Candidate]:",
          JSON.stringify(cand),
        );
        throw new HttpError(
          502,
          `Gemini returned an empty response${cand?.finishReason ? ` (${cand.finishReason})` : ""}. Please retry.`,
        );
      }
      if (cand?.finishReason === "MAX_TOKENS") {
        console.error("[Gemini MAX_TOKENS truncation]:", text.slice(-500));
        throw new HttpError(
          502,
          "The AI response was too long and got cut off. Try again with fewer pages/questions per batch.",
        );
      }
      return parseJsonLoose(text);
    } catch (e) {
      if (e instanceof HttpError && [429, 500, 502, 503].includes(e.status)) {
        lastError = e;
        continue;
      }
      throw e;
    }
  }

  if (lastError) throw lastError;
  throw new HttpError(
    503,
    "Gemini is temporarily unavailable. Please try again later.",
  );
}

export function errorResponse(e: unknown) {
  if (e instanceof HttpError) {
    console.error(`[API HttpError ${e.status}]:`, e.message);
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  console.error("[API Unexpected Error]:", e);
  return NextResponse.json(
    { error: "Unexpected server error" },
    { status: 500 },
  );
}
