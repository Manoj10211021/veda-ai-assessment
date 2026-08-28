"use client";

import { useState } from "react";

const CLASSES = [
  { name: "Class X-A", subject: "Mathematics", students: 38, avg: "74%", attendance: "96%", color: "from-violet-500/15 to-violet-500/5", text: "text-violet-700", icon: "📐" },
  { name: "Class X-B", subject: "Biology", students: 36, avg: "55%", attendance: "91%", color: "from-rose-500/15 to-rose-500/5", text: "text-rose-700", icon: "🧬" },
  { name: "Class XI-B", subject: "Physics", students: 34, avg: "68%", attendance: "94%", color: "from-amber-500/15 to-amber-500/5", text: "text-amber-700", icon: "⚡" },
  { name: "Class XII-A", subject: "Chemistry", students: 32, avg: "81%", attendance: "98%", color: "from-emerald-500/15 to-emerald-500/5", text: "text-emerald-700", icon: "🧪" },
];

const STUDENTS = [
  { name: "Aarav Sharma", roll: "001", score: "82%", grade: "A", avatar: "AS", submissions: "12/12", status: "Active" },
  { name: "Priya Nair", roll: "002", score: "76%", grade: "B+", avatar: "PN", submissions: "11/12", status: "Active" },
  { name: "Rohan Mehta", roll: "003", score: "91%", grade: "A+", avatar: "RM", submissions: "12/12", status: "Top Performer" },
  { name: "Sneha Pillai", roll: "004", score: "63%", grade: "B", avatar: "SP", submissions: "10/12", status: "Needs Attention" },
  { name: "Arjun Kapoor", roll: "005", score: "55%", grade: "C+", avatar: "AK", submissions: "8/12", status: "Needs Attention" },
  { name: "Divya Rao", roll: "006", score: "88%", grade: "A", avatar: "DR", submissions: "12/12", status: "Active" },
  { name: "Karan Singh", roll: "007", score: "71%", grade: "B+", avatar: "KS", submissions: "11/12", status: "Active" },
  { name: "Meera Joshi", roll: "008", score: "94%", grade: "A+", avatar: "MJ", submissions: "12/12", status: "Top Performer" },
];

const GRADE_COLORS: Record<string, string> = {
  "A+": "bg-good-100 text-good-600 border border-good-600/20",
  "A": "bg-good-100 text-good-600 border border-good-600/20",
  "B+": "bg-warn-100 text-warn-700 border border-warn-700/20",
  "B": "bg-warn-100 text-warn-700 border border-warn-700/20",
  "C+": "bg-bad-100 text-bad-600 border border-bad-600/20",
  "C": "bg-bad-100 text-bad-600 border border-bad-600/20",
};

export function ClassroomScreen() {
  const [selected, setSelected] = useState(0);
  const [search, setSearch] = useState("");
  const cls = CLASSES[selected];

  const filteredStudents = STUDENTS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search)
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 fade-in">
          <div>
            <p className="text-xs font-extrabold tracking-widest text-ink-400 uppercase">
              Roster &amp; Analytics
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">My Classroom</h1>
            <p className="mt-1 text-[15px] font-medium text-ink-500">
              Manage student profiles, performance metrics, and learning gaps
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-black active:scale-95">
            <span>+</span> Add Student
          </button>
        </div>

        {/* Class switcher pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {CLASSES.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setSelected(i)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold transition-all ${
                selected === i
                  ? "bg-ink-900 text-white shadow-md ring-2 ring-brand-500/50"
                  : "border border-line bg-white text-ink-700 hover:border-ink-400/40 hover:bg-paper"
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Selected class banner */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-card)] sm:grid-cols-4">
          <div className="flex items-center gap-4 sm:col-span-2">
            <div
              className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-3xl shadow-inner ${cls.color}`}
            >
              {cls.icon}
            </div>
            <div className="min-w-0">
              <div className="text-xl font-extrabold text-ink-900">{cls.name}</div>
              <div className="text-sm font-semibold text-ink-500">{cls.subject}</div>
              <div className="mt-1 text-xs font-bold text-brand-600">DPS Bokaro Steel City</div>
            </div>
          </div>
          <div className="flex items-center justify-around border-t border-line pt-4 sm:col-span-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-ink-900">{cls.students}</div>
              <div className="text-xs font-semibold text-ink-500">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-brand-500">{cls.avg}</div>
              <div className="text-xs font-semibold text-ink-500">Class Average</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-good-600">{cls.attendance}</div>
              <div className="text-xs font-semibold text-ink-500">Attendance</div>
            </div>
          </div>
        </div>

        {/* Search & filters */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-extrabold tracking-wide text-ink-600 uppercase">
            Enrolled Students ({filteredStudents.length})
          </div>
          <div className="relative w-full sm:w-72">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or roll #…"
              className="w-full rounded-full border border-line bg-white px-4 py-2 text-xs font-medium text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Student card grid */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filteredStudents.map((s) => (
            <div
              key={s.roll}
              className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-4.5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-xs font-extrabold text-white shadow-sm">
                  {s.avatar}
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                    GRADE_COLORS[s.grade] ?? "bg-paper text-ink-600"
                  }`}
                >
                  {s.grade}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-sm font-bold text-ink-900 group-hover:text-brand-600 transition-colors">
                  {s.name}
                </div>
                <div className="text-xs font-medium text-ink-500">Roll #{s.roll}</div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 text-xs">
                <span className="font-semibold text-ink-500">Score: <strong className="font-extrabold text-ink-900">{s.score}</strong></span>
                <span className="font-medium text-ink-400">{s.submissions} tests</span>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="mt-12 text-center text-sm font-semibold text-ink-400">
            No students found matching &ldquo;{search}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
