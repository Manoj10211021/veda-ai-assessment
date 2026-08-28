"use client";

import { useRef, useState } from "react";
import { fmtSize } from "@/lib/client";
import { IconArrowRight, IconUpload, IconX, ImgBadge, PdfBadge } from "./icons";

export const QP_MAX_PAGES = 12;
export const AS_MAX_PAGES = 16;

export type FileMetaT = { id: string; file: File; pages: number };

export function UploadScreen({
  qp,
  as,
  onAdd,
  onRemove,
  onStart,
  error,
}: {
  qp: FileMetaT[];
  as: FileMetaT[];
  onAdd: (side: "qp" | "as", files: FileList | null) => void;
  onRemove: (side: "qp" | "as", id: string) => void;
  onStart: () => void;
  error: string | null;
}) {
  const canStart = qp.length > 0 && as.length > 0;
  const qpPages = qp.reduce((n, m) => n + m.pages, 0);
  const asPages = as.reduce((n, m) => n + m.pages, 0);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-10 text-center">
        {/* Hero text */}
        <div className="fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-extrabold tracking-wide text-brand-600 uppercase">
            ✨ Powered by Gemini AI
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-[44px] sm:leading-[1.15]">
            Upload{" "}
            <span className="rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-1 text-white">
              Q & A Sheets
            </span>
          </h1>
          <p className="mt-3 text-[15px] font-medium text-ink-600">
            Upload a question paper and answer sheet — AI extracts, maps and
            grades everything instantly
          </p>
        </div>

        <OrbitAvatar />

        {/* Drop cards */}
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <DropCard
            title="Question Paper"
            metas={qp}
            totalPages={qpPages}
            maxPages={QP_MAX_PAGES}
            onAdd={(f) => onAdd("qp", f)}
            onRemove={(id) => onRemove("qp", id)}
            accent="from-violet-500/10 to-brand-500/5"
            borderActive="border-violet-400"
          />
          <DropCard
            title="Answer Sheet"
            metas={as}
            totalPages={asPages}
            maxPages={AS_MAX_PAGES}
            onAdd={(f) => onAdd("as", f)}
            onRemove={(id) => onRemove("as", id)}
            accent="from-brand-500/10 to-brand-400/5"
            borderActive="border-brand-400"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="slide-up mt-5 w-full rounded-xl border border-bad-600/25 bg-bad-100 px-4 py-3 text-left text-sm font-semibold text-bad-600">
            ⚠️ {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={onStart}
          disabled={!canStart}
          className={`mt-8 flex items-center gap-2.5 rounded-full px-8 py-3.5 text-[15px] font-extrabold text-white shadow-lg transition-all ${
            canStart
              ? "bg-ink-900 hover:scale-[1.02] hover:bg-ink-800 hover:shadow-xl active:scale-100"
              : "cursor-not-allowed bg-ink-200 shadow-none"
          }`}
        >
          Start Mapping
          <IconArrowRight className="h-4.5 w-4.5" />
        </button>

        <div className="mt-4 flex flex-col items-center gap-1">
          <p className="text-[13px] text-ink-500">
            Both files needed · No data stored on our servers
          </p>
          <p className="text-[11px] text-ink-400">
            AI powered by Google Gemini 2.5 Flash
          </p>
        </div>
      </div>
    </div>
  );
}

function DropCard({
  title,
  metas,
  totalPages,
  maxPages,
  onAdd,
  onRemove,
  accent,
  borderActive,
}: {
  title: string;
  metas: FileMetaT[];
  totalPages: number;
  maxPages: number;
  onAdd: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  accent: string;
  borderActive: string;
}) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        onAdd(e.dataTransfer.files);
      }}
      className={`rounded-3xl border-2 p-3 transition-all ${
        drag
          ? `border-brand-500 bg-gradient-to-br ${accent}`
          : "border-[#E2DDD7] bg-white hover:border-ink-200"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="application/pdf,image/*"
        className="hidden"
        onChange={(e) => {
          onAdd(e.target.files);
          e.target.value = "";
        }}
      />

      {metas.length === 0 ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-3 rounded-2xl px-4 py-10 transition hover:bg-paper/60"
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-paper to-paper-dark shadow-inner ring-1 ring-line">
            <IconUpload className="h-6 w-6 text-ink-700" />
          </span>
          <span>
            <span className="block text-[17px] font-extrabold text-ink-900">
              Upload <span className="text-brand-500">{title}</span>
            </span>
            <span className="mt-0.5 block text-xs font-medium text-ink-500">
              PDF or image · Max 10 MB
            </span>
          </span>
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          {metas.map((m) => (
            <div
              key={m.id}
              className="relative flex items-center gap-3 rounded-2xl bg-white p-3 pr-10 shadow-[var(--shadow-card)] ring-1 ring-black/5"
            >
              {m.file.type === "application/pdf" ? <PdfBadge /> : <ImgBadge />}
              <div className="min-w-0 text-left">
                <div className="truncate text-sm font-bold text-ink-900">
                  {m.file.name}
                </div>
                <div className="text-xs text-ink-500">
                  {fmtSize(m.file.size)} ·{" "}
                  {m.pages === 0 ? (
                    <span className="inline-block h-2.5 w-8 animate-pulse rounded-sm bg-ink-200" />
                  ) : (
                    <>
                      {m.pages} {m.pages === 1 ? "page" : "pages"}
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => onRemove(m.id)}
                aria-label="Remove file"
                className="absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-ink-900 text-white transition hover:bg-bad-600"
              >
                <IconX className="h-3 w-3" />
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between px-1 pt-1">
            <button
              onClick={() => inputRef.current?.click()}
              className="text-sm font-bold text-brand-600 transition hover:text-brand-700 hover:underline"
            >
              + Add more
            </button>
            {totalPages > maxPages && (
              <span className="text-[11px] font-semibold text-warn-700">
                First {maxPages} pages used
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const ORBITS = [
  { emoji: "✓", cls: "top-0 left-8", delay: "0s", bg: "bg-good-600" },
  { emoji: "✏️", cls: "top-8 -right-2", delay: "0.6s", bg: "bg-brand-500" },
  { emoji: "📄", cls: "bottom-3 -left-2", delay: "1.2s", bg: "bg-violet-500" },
  { emoji: "💡", cls: "right-8 -bottom-1", delay: "1.8s", bg: "bg-amber-500" },
];

function OrbitAvatar() {
  return (
    <div className="relative my-8 h-32 w-32 shrink-0">
      {/* Glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-brand-100/70 to-transparent" />
      {/* Inner circle */}
      <div className="absolute inset-3 rounded-full bg-white shadow-md ring-1 ring-black/5" />
      {/* Emoji */}
      <div className="absolute inset-0 grid place-items-center text-[56px] select-none">
        👩🏽‍🏫
      </div>
      {/* Orbit items */}
      {ORBITS.map((o) => (
        <span
          key={o.emoji}
          className={`bob absolute grid h-8 w-8 place-items-center rounded-full text-sm text-white shadow-md ring-2 ring-white ${o.bg} ${o.cls}`}
          style={{ animationDelay: o.delay }}
        >
          {o.emoji}
        </span>
      ))}
    </div>
  );
}
