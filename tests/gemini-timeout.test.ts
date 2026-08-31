import test from "node:test";
import assert from "node:assert/strict";
import { getGeminiModelCandidates } from "../src/lib/gemini";
import { getGeminiTimeoutMs } from "../src/lib/gemini-timeout";

test("gemini model fallback prefers the supported 3.6 flash model", () => {
  const models = getGeminiModelCandidates();
  assert.equal(models[0], "gemini-3.6-flash");
  assert.ok(models.includes("gemini-3.6-flash"));
});

test("single-page Gemini requests use a longer timeout than the previous 55s limit", () => {
  assert.equal(getGeminiTimeoutMs(1), 120000);
  assert.ok(getGeminiTimeoutMs(1) > 55000);
  assert.ok(getGeminiTimeoutMs(6) > getGeminiTimeoutMs(1));
});
