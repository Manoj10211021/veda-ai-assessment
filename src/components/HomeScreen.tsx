"use client";

const STATS = [
  {
    label: "Total Students",
    value: "124",
    icon: "👨‍🎓",
    gradient: "from-violet-500/15 to-transparent",
    border: "border-violet-200",
    text: "text-violet-700",
  },
  {
    label: "Exams This Month",
    value: "8",
    icon: "📋",
    gradient: "from-brand-500/15 to-transparent",
    border: "border-brand-200",
    text: "text-brand-600",
  },
  {
    label: "Avg Score",
    value: "74%",
    icon: "📈",
    gradient: "from-emerald-500/15 to-transparent",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
  {
    label: "Pending Reviews",
    value: "3",
    icon: "⏳",
    gradient: "from-amber-500/15 to-transparent",
    border: "border-amber-200",
    text: "text-amber-700",
  },
];

const RECENT = [
  { subject: "Mathematics – Chapter 5", class: "Class X-A", date: "Aug 24", score: "72%", ok: true },
  { subject: "Physics – Thermodynamics", class: "Class XI-B", date: "Aug 22", score: "68%", ok: null },
  { subject: "Chemistry – Organic", class: "Class XII-A", date: "Aug 20", score: "81%", ok: true },
  { subject: "Biology – Cell Biology", class: "Class X-B", date: "Aug 18", score: "55%", ok: false },
];

const QUICK = [
  { icon: "📤", label: "Grade New Exam", sub: "Upload & auto-grade", dark: true, href: "exams" },
  { icon: "📚", label: "My Library", sub: "Browse resources", dark: false, href: "library" },
  { icon: "🏫", label: "My Classroom", sub: "View students", dark: false, href: "classroom" },
  { icon: "📝", label: "Assignments", sub: "Track submissions", dark: false, href: "assignments" },
];

function scoreBadge(ok: boolean | null) {
  if (ok === true) return "bg-good-100 text-good-600";
  if (ok === false) return "bg-bad-100 text-bad-600";
  return "bg-warn-100 text-warn-700";
}

export function HomeScreen({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <p className="text-xs font-extrabold tracking-widest text-ink-400 uppercase">
            Tuesday, 26 August 2026
          </p>
          <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-ink-900">
            Good afternoon, <span className="text-brand-500">Madhur</span> 👋
          </h1>
          <p className="mt-1 text-[15px] font-medium text-ink-500">
            Here's a snapshot of your classes today
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl border bg-gradient-to-br bg-white ${s.border} ${s.gradient} p-5 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-lift)]`}
            >
              <span className="text-2xl">{s.icon}</span>
              <div className={`mt-3 text-[32px] font-extrabold tracking-tight ${s.text}`}>
                {s.value}
              </div>
              <div className="mt-0.5 text-xs font-semibold text-ink-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="mb-3 text-[11px] font-extrabold tracking-widest text-ink-400 uppercase">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {QUICK.map((q) => (
              <button
                key={q.label}
                onClick={() => onNavigate(q.href)}
                className={`flex flex-col items-start gap-3 rounded-2xl p-4 text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] active:translate-y-0 ${
                  q.dark
                    ? "bg-ink-900 text-white"
                    : "bg-white text-ink-900 ring-1 ring-line"
                }`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-xl shadow-sm ring-1 ring-black/5">
                  {q.icon}
                </span>
                <span>
                  <span className="block text-sm font-extrabold">{q.label}</span>
                  <span className={`block text-[11px] font-medium ${q.dark ? "text-white/60" : "text-ink-500"}`}>
                    {q.sub}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Exams */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] font-extrabold tracking-widest text-ink-400 uppercase">
              Recent Exams
            </h2>
            <button
              onClick={() => onNavigate("exams")}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]">
            {RECENT.map((r, i) => (
              <div
                key={r.subject}
                className={`flex items-center gap-4 px-5 py-4 transition hover:bg-paper/50 ${
                  i < RECENT.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-paper text-lg ring-1 ring-line">
                  📋
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-bold text-ink-900">{r.subject}</div>
                  <div className="text-[11px] font-medium text-ink-500">
                    {r.class} · {r.date}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${scoreBadge(r.ok)}`}
                >
                  {r.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight card */}
        <div className="mt-5 flex items-start gap-4 rounded-2xl border border-brand-200/60 bg-gradient-to-br from-brand-50 to-white p-5 shadow-[var(--shadow-card)]">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500 text-lg text-white shadow-md">
            ✨
          </div>
          <div>
            <div className="text-[13px] font-extrabold text-ink-900">AI Insight</div>
            <p className="mt-0.5 text-[13px] leading-relaxed text-ink-600">
              Class X-B's average in Biology dropped 12% this month. Consider a remedial session
              before the next assessment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
