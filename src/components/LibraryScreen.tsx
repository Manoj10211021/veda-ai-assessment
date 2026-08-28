"use client";

import { useState } from "react";

type Category = "all" | "question-papers" | "notes" | "worksheets";

const RESOURCES = [
  {
    title: "Mathematics – Class X Full Syllabus Question Bank",
    category: "question-papers" as const,
    size: "2.4 MB",
    date: "Aug 20, 2026",
    icon: "📘",
    color: "from-violet-500/15 to-violet-500/5",
    tag: "Board Exam Prep",
    downloads: 142,
  },
  {
    title: "Physics – Thermodynamics Key Concepts & Formula Sheet",
    category: "notes" as const,
    size: "1.1 MB",
    date: "Aug 18, 2026",
    icon: "📗",
    color: "from-emerald-500/15 to-emerald-500/5",
    tag: "Formulas & Derivations",
    downloads: 98,
  },
  {
    title: "Chemistry – Organic Reaction Mechanisms Worksheet",
    category: "worksheets" as const,
    size: "800 KB",
    date: "Aug 15, 2026",
    icon: "📙",
    color: "from-amber-500/15 to-amber-500/5",
    tag: "Practice Set",
    downloads: 75,
  },
  {
    title: "Biology – Cell Division & Genetics MCQ Question Bank",
    category: "question-papers" as const,
    size: "650 KB",
    date: "Aug 12, 2026",
    icon: "📕",
    color: "from-rose-500/15 to-rose-500/5",
    tag: "Multiple Choice",
    downloads: 110,
  },
  {
    title: "Mathematics – Quadratic Equations Quick Notes",
    category: "notes" as const,
    size: "960 KB",
    date: "Aug 10, 2026",
    icon: "📘",
    color: "from-violet-500/15 to-violet-500/5",
    tag: "Revision Notes",
    downloads: 89,
  },
  {
    title: "English – Reading Comprehension & Analysis Set",
    category: "worksheets" as const,
    size: "1.3 MB",
    date: "Aug 8, 2026",
    icon: "📓",
    color: "from-sky-500/15 to-sky-500/5",
    tag: "Critical Reading",
    downloads: 64,
  },
  {
    title: "Physics – Ray & Wave Optics Previous Years Papers",
    category: "question-papers" as const,
    size: "1.8 MB",
    date: "Aug 5, 2026",
    icon: "📗",
    color: "from-emerald-500/15 to-emerald-500/5",
    tag: "PYQs",
    downloads: 130,
  },
  {
    title: "Chemistry – Electrochemistry & Nernst Equation Notes",
    category: "notes" as const,
    size: "720 KB",
    date: "Aug 2, 2026",
    icon: "📙",
    color: "from-amber-500/15 to-amber-500/5",
    tag: "Chapter Notes",
    downloads: 58,
  },
];

const CAT_LABEL: Record<string, string> = {
  all: "All Resources",
  "question-papers": "Question Papers",
  notes: "Study Notes",
  worksheets: "Worksheets",
};

export function LibraryScreen() {
  const [cat, setCat] = useState<Category>("all");
  const [search, setSearch] = useState("");

  const shown = RESOURCES.filter(
    (r) =>
      (cat === "all" || r.category === cat) &&
      (search === "" ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 fade-in">
          <div>
            <p className="text-xs font-extrabold tracking-widest text-ink-400 uppercase">
              Resource Hub &amp; Archives
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">My Library</h1>
            <p className="mt-1 text-[15px] font-medium text-ink-500">
              Your curriculum documents, question banks, and worksheets in one searchable vault
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-black active:scale-95">
            <span>+</span> Upload Resource
          </button>
        </div>

        {/* Search + filter tabs */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(["all", "question-papers", "notes", "worksheets"] as Category[]).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition ${
                  cat === c
                    ? "bg-ink-900 text-white shadow-sm"
                    : "border border-line bg-white text-ink-600 hover:bg-paper"
                }`}
              >
                {CAT_LABEL[c]}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search library documents…"
              className="w-full rounded-full border border-line bg-white px-4 py-2 text-xs font-medium text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Resource grid */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r) => (
            <div
              key={r.title}
              className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-[var(--shadow-lift)]"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-2xl shadow-inner ${r.color}`}
                  >
                    {r.icon}
                  </div>
                  <span className="rounded-full bg-paper px-2.5 py-0.5 text-[11px] font-bold text-ink-600">
                    {r.tag}
                  </span>
                </div>
                <h3 className="mt-3.5 line-clamp-2 text-sm font-bold leading-snug text-ink-900 group-hover:text-brand-600 transition-colors">
                  {r.title}
                </h3>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3 text-[11px] font-medium text-ink-500">
                <span>{r.size} • {r.date}</span>
                <span className="font-semibold text-ink-700">📥 {r.downloads}</span>
              </div>
            </div>
          ))}
        </div>

        {shown.length === 0 && (
          <div className="mt-16 text-center text-sm font-semibold text-ink-400">
            No library resources matched &ldquo;{search}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
