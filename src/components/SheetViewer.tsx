"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PageImage, Segment } from "@/lib/types";
import { IconChevronLeft, IconChevronRight, IconMinus, IconPlus } from "./icons";

export function SheetViewer({
  pages,
  segments,
  selectedSegments,
  unmatchedIds,
  jumpSegId,
  onJumpDone,
}: {
  pages: PageImage[];
  segments: Segment[];
  selectedSegments: Segment[];
  unmatchedIds: Set<string>;
  jumpSegId: string | null;
  onJumpDone: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scale, setScale] = useState(1);
  const [baseW, setBaseW] = useState(720);
  const [current, setCurrent] = useState(1);
  const [flash, setFlash] = useState<string | null>(null);

  useLayoutEffect(() => {
    const c = scrollRef.current;
    if (!c) return;
    const measure = () => setBaseW(Math.min(c.clientWidth - 40, 780));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!jumpSegId) return;
    const seg = segments.find((s) => s.id === jumpSegId);
    if (!seg) {
      onJumpDone();
      return;
    }
    const el = pageRefs.current[seg.page - 1];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setFlash(jumpSegId);
      const t = setTimeout(() => setFlash(null), 2600);
      onJumpDone();
      return () => clearTimeout(t);
    }
    onJumpDone();
  }, [jumpSegId, segments, onJumpDone]);

  const onScroll = () => {
    const c = scrollRef.current;
    if (!c) return;
    const st = c.scrollTop;
    let cur = 1;
    pageRefs.current.forEach((el, i) => {
      if (el && el.offsetTop <= st + c.clientHeight * 0.35) cur = i + 1;
    });
    setCurrent(cur);
  };

  const goToPage = (i: number) => {
    const clamped = Math.min(pages.length, Math.max(1, i));
    pageRefs.current[clamped - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const zoom = (dir: 1 | -1) =>
    setScale((s) => Math.min(2, Math.max(0.5, Math.round((s + dir * 0.1) * 10) / 10)));

  const selectedIds = new Set(selectedSegments.map((s) => s.id));
  const byPage = new Map<number, Segment[]>();
  for (const s of segments) {
    if (!selectedIds.has(s.id) && !unmatchedIds.has(s.id)) continue;
    const list = byPage.get(s.page) ?? [];
    list.push(s);
    byPage.set(s.page, list);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
        <h2 className="text-[15px] font-extrabold">Answer Sheet</h2>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center rounded-full border border-line">
            <button
              onClick={() => zoom(-1)}
              aria-label="Zoom out"
              className="grid h-8 w-8 place-items-center rounded-full text-ink-700 hover:bg-paper"
            >
              <IconMinus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-xs font-extrabold">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => zoom(1)}
              aria-label="Zoom in"
              className="grid h-8 w-8 place-items-center rounded-full text-ink-700 hover:bg-paper"
            >
              <IconPlus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center rounded-full border border-line">
            <button
              onClick={() => goToPage(current - 1)}
              disabled={current <= 1}
              aria-label="Previous page"
              className="grid h-8 w-8 place-items-center rounded-full text-ink-700 hover:bg-paper disabled:opacity-30"
            >
              <IconChevronLeft className="h-4 w-4" />
            </button>
            <span className="w-24 text-center text-xs font-extrabold">
              Page {current} of {pages.length || 1}
            </span>
            <button
              onClick={() => goToPage(current + 1)}
              disabled={current >= pages.length}
              aria-label="Next page"
              className="grid h-8 w-8 place-items-center rounded-full text-ink-700 hover:bg-paper disabled:opacity-30"
            >
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} onScroll={onScroll} className="relative flex-1 overflow-y-auto bg-[#EDEAE5] p-5">
        <div className="mx-auto flex flex-col items-center gap-6" style={{ width: baseW * scale }}>
          {pages.map((p, i) => (
            <div
              key={p.index}
              ref={(el) => {
                pageRefs.current[i] = el;
              }}
              className="relative w-full overflow-hidden rounded-md bg-white shadow-[0_2px_12px_rgba(0,0,0,0.09)] ring-1 ring-black/5"
            >
              <img
                src={p.dataUrl}
                alt={`Answer sheet page ${i + 1}`}
                draggable={false}
                className="block w-full select-none"
              />
              {(byPage.get(p.index) ?? []).map((seg) => {
                const isSel = selectedIds.has(seg.id);
                const [ymin, xmin, ymax, xmax] = seg.box_2d;
                const disp = /^q/i.test(seg.label) ? seg.label : `Q${seg.label}`;
                return (
                  <div
                    key={seg.id}
                    className={
                      "absolute rounded-lg border-[3px] transition-colors " +
                      (isSel
                        ? "border-good-600 bg-good-600/15" + (flash === seg.id ? " flash-hl" : "")
                        : "border-bad-600 bg-bad-600/10 border-dashed")
                    }
                    style={{
                      left: `${xmin / 10}%`,
                      top: `${ymin / 10}%`,
                      width: `${(xmax - xmin) / 10}%`,
                      height: `${(ymax - ymin) / 10}%`,
                    }}
                  >
                    <span
                      className={
                        "absolute top-1.5 left-1.5 rounded-md px-2 py-0.5 text-xs font-extrabold text-white shadow " +
                        (isSel ? "bg-good-600" : "bg-bad-600")
                      }
                    >
                      {disp}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
          {!pages.length && (
            <div className="py-24 text-sm font-semibold text-ink-600">No pages to display</div>
          )}
        </div>
      </div>
    </div>
  );
}
