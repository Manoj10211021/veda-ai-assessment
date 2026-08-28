"use client";

import { IconCheck, SparkleGlyph } from "./icons";

const STEPS = [
  { label: "Extracting questions", sub: "Analysing question paper…" },
  { label: "Extracting answers", sub: "Reading handwritten answer sheets…" },
  { label: "Mapping & grading", sub: "AI is grading and writing feedback…" },
];

export function LoadingScreen({ step }: { step: number }) {
  return (
    <div className="grid h-full place-items-center p-6">
      <div className="flex flex-col items-center text-center">
        {/* Animated icon */}
        <div className="relative mb-8">
          <div className="h-24 w-24 animate-[sparkle_1.6s_ease-in-out_infinite]">
            <SparkleGlyph className="h-24 w-24" />
          </div>
          {/* Pulsing glow ring */}
          <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-brand-500/10" />
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">Processing…</h2>
        <p className="mt-1.5 text-[15px] font-medium text-ink-500">This may take 15–45 seconds</p>

        {/* Step list */}
        <div className="mt-8 w-full max-w-xs space-y-3">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div
                key={s.label}
                className={`flex items-center gap-3.5 rounded-2xl p-3.5 text-left transition-all ${
                  active
                    ? "bg-white shadow-[var(--shadow-card)] ring-1 ring-brand-500/20"
                    : done
                    ? "opacity-60"
                    : "opacity-30"
                }`}
              >
                {/* Step indicator */}
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-all ${
                    done
                      ? "bg-good-600 text-white"
                      : active
                      ? "bg-brand-500 text-white shadow-md"
                      : "bg-paper text-ink-400"
                  }`}
                >
                  {done ? (
                    <IconCheck className="h-4.5 w-4.5" />
                  ) : active ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <span className="text-sm font-extrabold">{i + 1}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div
                    className={`text-sm font-extrabold ${
                      active ? "text-ink-900" : done ? "text-good-600" : "text-ink-400"
                    }`}
                  >
                    {s.label}
                  </div>
                  {active && (
                    <div className="mt-0.5 text-xs font-medium text-ink-500">{s.sub}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1 w-full max-w-xs overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-700"
            style={{ width: `${((step) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-ink-400">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  );
}
