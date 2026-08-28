"use client";

import { useMemo, useState } from "react";
import { normLabel } from "@/lib/normalize";
import { fmtNum } from "@/lib/client";
import type { AnalysisResult, MapResult, PageImage, Question, Segment } from "@/lib/types";
import { SheetViewer } from "./SheetViewer";
import { IconChevronDown } from "./icons";

export function ResultsScreen({
  analysis,
  pages,
}: {
  analysis: AnalysisResult;
  pages: PageImage[];
}) {
  const [selQ, setSelQ] = useState<string | null>(null);
  const [selU, setSelU] = useState<string | null>(null);
  const [tab, setTab] = useState<"questions" | "sheet">("questions");
  const [allExpanded, setAllExpanded] = useState(false);
  const [ownExpanded, setOwnExpanded] = useState<Set<string>>(new Set());
  const [jumpSegId, setJumpSegId] = useState<string | null>(null);

  const resultByKey = useMemo(
    () => new Map(analysis.results.map((r) => [r.key, r])),
    [analysis]
  );
  const segById = useMemo(() => new Map(analysis.segments.map((s) => [s.id, s])), [analysis]);

  const selectedSegments: Segment[] = useMemo(() => {
    if (selQ) {
      const r = resultByKey.get(selQ);
      return (r?.segment_ids ?? [])
        .map((id) => segById.get(id))
        .filter(Boolean) as Segment[];
    }
    if (selU) {
      const s = segById.get(selU);
      return s ? [s] : [];
    }
    return [];
  }, [selQ, selU, resultByKey, segById]);

  const unmatchedIds = useMemo(
    () => new Set(analysis.unmatched.map((u) => u.id)),
    [analysis]
  );

  const stats = useMemo(() => {
    let score = 0;
    let max = 0;
    let answered = 0;
    for (const r of analysis.results) {
      score += r.score;
      max += r.max_marks || 0;
      if (r.status === "answered") answered++;
    }
    return { score, max, answered, total: analysis.results.length };
  }, [analysis]);

  const selectQuestion = (key: string, firstSegId?: string) => {
    setSelQ((prev) => (prev === key ? null : key));
    setSelU(null);
    if (key !== selQ && firstSegId) {
      setTab("sheet");
      setJumpSegId(firstSegId);
    }
  };

  const selectUnmatched = (id: string) => {
    setSelU((prev) => (prev === id ? null : id));
    setSelQ(null);
    if (id !== selU) {
      setTab("sheet");
      setJumpSegId(id);
    }
  };

  const toggleExpand = (key: string) =>
    setOwnExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3 lg:flex-row">
      <div className="flex shrink-0 rounded-full border border-line bg-white p-1 lg:hidden">
        {(["questions", "sheet"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "flex-1 rounded-full px-5 py-2 text-sm font-extrabold transition " +
              (tab === t ? "bg-ink-900 text-white" : "text-ink-600")
            }
          >
            {t === "questions" ? "Questions" : "Answer Sheet"}
          </button>
        ))}
      </div>

      <section
        className={
          "min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-line bg-white lg:flex lg:w-[440px] lg:shrink-0 " +
          (tab === "questions" ? "flex" : "hidden")
        }
      >
        <div className="flex items-center justify-between gap-2 px-4 pt-4">
          <div>
            <h2 className="text-[15px] font-extrabold">Extracted Questions</h2>
            <p className="text-xs font-semibold text-ink-600">(from question paper)</p>
          </div>
          <button
            onClick={() => setAllExpanded((v) => !v)}
            className="rounded-full border border-line px-3.5 py-1.5 text-xs font-bold transition hover:bg-paper"
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 px-4 pt-3">
          <span className="rounded-full bg-good-100 px-2.5 py-1 text-xs font-extrabold text-good-600">
            {fmtNum(stats.score)}/{fmtNum(stats.max)} marks
          </span>
          <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-extrabold text-ink-700">
            {stats.answered}/{stats.total} answered
          </span>
          {analysis.unmatched.length > 0 && (
            <span className="rounded-full bg-bad-100 px-2.5 py-1 text-xs font-extrabold text-bad-600">
              {analysis.unmatched.length} unmatched
            </span>
          )}
        </div>
        {analysis.overall_summary && (
          <p className="px-4 pt-2 text-xs leading-relaxed text-ink-600">
            <span className="font-extrabold text-ink-700">AI Summary: </span>
            {analysis.overall_summary}
          </p>
        )}

        <div className="mt-2 flex-1 space-y-2.5 overflow-y-auto p-3 pt-1">
          {analysis.questions.map((q) => {
            const key = normLabel(q.label);
            const r = resultByKey.get(key);
            const segs = (r?.segment_ids ?? [])
              .map((id) => segById.get(id))
              .filter(Boolean) as Segment[];
            return (
              <QuestionCard
                key={key + q.label}
                q={q}
                result={r}
                segs={segs}
                selected={selQ === key}
                expanded={allExpanded || ownExpanded.has(key)}
                onToggle={() => toggleExpand(key)}
                onSelect={() => selectQuestion(key, segs[0]?.id)}
                onJumpSeg={(id) => {
                  setTab("sheet");
                  setJumpSegId(id);
                }}
              />
            );
          })}

          {analysis.unmatched.length > 0 && (
            <div className="pt-3">
              <h3 className="px-1 pb-2 text-xs font-extrabold tracking-wide text-bad-600 uppercase">
                Unmatched answers ({analysis.unmatched.length})
              </h3>
              <div className="space-y-2.5">
                {analysis.unmatched.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => selectUnmatched(u.id)}
                    className={
                      "flex w-full gap-3 rounded-2xl border p-3.5 text-left transition " +
                      (selU === u.id
                        ? "border-bad-600 bg-bad-100/50"
                        : "border-bad-600/30 bg-white hover:border-bad-600/60")
                    }
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bad-600 text-sm font-extrabold text-white">
                      ?
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">
                        Answer labelled &ldquo;{u.label}&rdquo;
                        <span className="font-semibold text-ink-600"> • Page {u.page}</span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-sm text-ink-600">
                        {u.text}
                      </span>
                      <span className="mt-1 block text-xs font-bold text-bad-600">{u.reason}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        className={
          "min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-white lg:flex " +
          (tab === "sheet" ? "flex" : "hidden")
        }
      >
        <SheetViewer
          pages={pages}
          segments={analysis.segments}
          selectedSegments={selectedSegments}
          unmatchedIds={unmatchedIds}
          jumpSegId={jumpSegId}
          onJumpDone={() => setJumpSegId(null)}
        />
      </section>
    </div>
  );
}

function QuestionCard({
  q,
  result,
  segs,
  selected,
  expanded,
  onToggle,
  onSelect,
  onJumpSeg,
}: {
  q: Question;
  result?: MapResult;
  segs: Segment[];
  selected: boolean;
  expanded: boolean;
  onToggle: () => void;
  onSelect: () => void;
  onJumpSeg: (id: string) => void;
}) {
  const answered = result?.status === "answered";
  const score = result?.score ?? 0;
  const max = result?.max_marks ?? q.max_marks ?? 2;
  const badge = !answered
    ? { cls: "bg-[#EFECE8] text-ink-600", text: "Not answered" }
    : score === 0
      ? { cls: "bg-bad-100 text-bad-600", text: `${fmtNum(score)}/${fmtNum(max)}` }
      : score * 2 >= max
        ? { cls: "bg-good-100 text-good-600", text: `${fmtNum(score)}/${fmtNum(max)}` }
        : { cls: "bg-warn-100 text-warn-700", text: `${fmtNum(score)}/${fmtNum(max)}` };

  const circleText = q.sub_part ? `${q.number}${q.sub_part}`.slice(0, 4) : q.number;
  const segPages = [...new Set(segs.map((s) => s.page))];

  return (
    <div
      className={
        "overflow-hidden rounded-2xl border bg-white transition " +
        (selected
          ? "border-brand-500 shadow-[0_0_0_1px_#f4571f]"
          : "border-line hover:border-ink-400/60")
      }
    >
      <div className="flex items-start gap-3 p-3.5">
        <button onClick={onSelect} className="flex min-w-0 flex-1 items-start gap-3 text-left">
          <span
            className={
              "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full font-extrabold text-white " +
              (circleText.length > 2 ? "px-1 text-[11px]" : "text-sm") +
              (selected ? " bg-brand-500" : " bg-ink-900")
            }
          >
            {circleText}
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={
                "block text-sm leading-snug font-semibold " + (expanded ? "" : "line-clamp-2")
              }
            >
              {q.text}
            </span>
            {q.section && (
              <span className="mt-1 inline-block rounded-md bg-paper px-1.5 py-0.5 text-[11px] font-bold text-ink-600">
                Section {q.section}
              </span>
            )}
          </span>
          <span
            className={
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold " + badge.cls
            }
          >
            {badge.text}
          </span>
        </button>
        <button
          onClick={onToggle}
          aria-label={expanded ? "Collapse" : "Expand"}
          className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-600 hover:bg-paper"
        >
          <IconChevronDown
            className={"h-4 w-4 transition-transform " + (expanded ? "rotate-180" : "")}
          />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-line px-3.5 pt-3 pb-3.5">
          <div className="text-xs font-extrabold tracking-wide text-ink-600 uppercase">
            AI Feedback
          </div>
          <p className="mt-1.5 rounded-xl border border-line bg-paper/60 p-3 text-sm leading-relaxed text-ink-700">
            {result?.feedback || "—"}
          </p>
          {answered && segPages.length > 0 && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-ink-600">Answer on:</span>
              {segs.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onJumpSeg(s.id)}
                  className="rounded-full border border-line px-2.5 py-0.5 text-xs font-bold text-brand-600 transition hover:bg-brand-50"
                >
                  Page {s.page}
                  {segPages.length > 1 && segs.filter((x) => x.page === s.page).length > 1
                    ? ` (${segs.filter((x) => x.page === s.page).findIndex((x) => x.id === s.id) + 1})`
                    : ""}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
