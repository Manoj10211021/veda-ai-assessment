"use client";

import { useState } from "react";

type Status = "all" | "pending" | "submitted" | "graded";

const ASSIGNMENTS = [
  {
    title: "Chapter 5 – Quadratic Equations & Algebra",
    class: "Class X-A",
    subject: "Mathematics",
    due: "Aug 28, 2026",
    submitted: 32,
    total: 38,
    status: "pending" as const,
    weight: "20 Marks",
  },
  {
    title: "Thermodynamics – Carnot Engine Problem Set",
    class: "Class XI-B",
    subject: "Physics",
    due: "Aug 25, 2026",
    submitted: 34,
    total: 34,
    status: "submitted" as const,
    weight: "15 Marks",
  },
  {
    title: "Organic Reaction Mechanisms – Lab Report",
    class: "Class XII-A",
    subject: "Chemistry",
    due: "Aug 20, 2026",
    submitted: 32,
    total: 32,
    status: "graded" as const,
    weight: "25 Marks",
  },
  {
    title: "Cell Cycle & Mitosis – Diagram & MCQ Sheet",
    class: "Class X-B",
    subject: "Biology",
    due: "Aug 18, 2026",
    submitted: 36,
    total: 36,
    status: "graded" as const,
    weight: "10 Marks",
  },
  {
    title: "Arithmetic Progressions – Practice Worksheet",
    class: "Class X-A",
    subject: "Mathematics",
    due: "Sep 2, 2026",
    submitted: 14,
    total: 38,
    status: "pending" as const,
    weight: "15 Marks",
  },
  {
    title: "Newton's Laws & Friction – Application Problems",
    class: "Class XI-B",
    subject: "Physics",
    due: "Sep 5, 2026",
    submitted: 8,
    total: 34,
    status: "pending" as const,
    weight: "20 Marks",
  },
];

const STATUS_CONFIG: Record<string, { badge: string; label: string; icon: string }> = {
  pending: { badge: "bg-warn-100 text-warn-700 border border-warn-700/20", label: "In Progress", icon: "⏳" },
  submitted: { badge: "bg-brand-50 text-brand-600 border border-brand-600/20", label: "Awaiting Grading", icon: "📥" },
  graded: { badge: "bg-good-100 text-good-600 border border-good-600/20", label: "Graded & Published", icon: "✅" },
};

export function AssignmentsScreen() {
  const [filter, setFilter] = useState<Status>("all");
  const [search, setSearch] = useState("");

  const filtered = ASSIGNMENTS.filter(
    (a) =>
      (filter === "all" || a.status === filter) &&
      (a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.class.toLowerCase().includes(search.toLowerCase()) ||
        a.subject.toLowerCase().includes(search.toLowerCase()))
  );

  const countFor = (s: Status) =>
    s === "all" ? ASSIGNMENTS.length : ASSIGNMENTS.filter((a) => a.status === s).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 fade-in">
          <div>
            <p className="text-xs font-extrabold tracking-widest text-ink-400 uppercase">
              Coursework &amp; Submissions
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">Assignments</h1>
            <p className="mt-1 text-[15px] font-medium text-ink-500">
              Track student submissions, verify workloads, and manage assignment schedules
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-black active:scale-95">
            <span>+</span> Create Assignment
          </button>
        </div>

        {/* Filter bar & search */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "submitted", "graded"] as Status[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition ${
                  filter === f
                    ? "bg-ink-900 text-white shadow-sm"
                    : "border border-line bg-white text-ink-600 hover:bg-paper"
                }`}
              >
                <span className="capitalize">{f === "all" ? "All" : f}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    filter === f ? "bg-white/20 text-white" : "bg-paper text-ink-600"
                  }`}
                >
                  {countFor(f)}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assignments…"
              className="w-full rounded-full border border-line bg-white px-4 py-2 text-xs font-medium text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Assignment list */}
        <div className="mt-4 space-y-3">
          {filtered.map((a) => {
            const pct = a.total > 0 ? Math.round((a.submitted / a.total) * 100) : 0;
            const cfg = STATUS_CONFIG[a.status];
            return (
              <div
                key={a.title}
                className="group flex flex-col justify-between gap-4 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-[var(--shadow-lift)] sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-paper text-2xl shadow-inner">
                    📝
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-ink-900 group-hover:text-brand-600 transition-colors">
                        {a.title}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${cfg.badge}`}
                      >
                        <span>{cfg.icon}</span>
                        <span>{cfg.label}</span>
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-medium text-ink-500">
                      <span className="font-bold text-ink-700">{a.class}</span>
                      <span>•</span>
                      <span>{a.subject}</span>
                      <span>•</span>
                      <span className="text-brand-600 font-semibold">{a.weight}</span>
                      <span>•</span>
                      <span>Due: <strong className="text-ink-700">{a.due}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="flex shrink-0 flex-col items-end gap-1.5 sm:w-44">
                  <div className="flex w-full justify-between text-xs">
                    <span className="font-medium text-ink-500">Submissions</span>
                    <span className="font-extrabold text-ink-900">{a.submitted}/{a.total} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-paper">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct === 100 ? "bg-good-600" : "bg-brand-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center text-sm font-semibold text-ink-400">
            No assignments match your search or filter.
          </div>
        )}
      </div>
    </div>
  );
}
