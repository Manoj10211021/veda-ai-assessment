"use client";

import {
  IconAssignments,
  IconChevronsRight,
  IconClassroom,
  IconExams,
  IconGrid,
  IconLibrary,
  IconPanel,
  IconSettings,
  IconSparkle,
  LogoMark,
} from "./icons";

export type NavPage = "home" | "classroom" | "assignments" | "exams" | "library";

const NAV: { icon: React.FC<{ className?: string }>; label: string; page: NavPage; emoji: string }[] = [
  { icon: IconGrid, label: "Home", page: "home", emoji: "⊞" },
  { icon: IconClassroom, label: "My Classroom", page: "classroom", emoji: "🏫" },
  { icon: IconAssignments, label: "Assignments", page: "assignments", emoji: "📝" },
  { icon: IconExams, label: "Exams", page: "exams", emoji: "📋" },
  { icon: IconLibrary, label: "My Library", page: "library", emoji: "📚" },
];

export function Sidebar({
  collapsed,
  activePage,
  onToggle,
  onNavigate,
  onOpenSettings,
}: {
  collapsed: boolean;
  activePage: NavPage;
  onToggle: () => void;
  onNavigate: (page: NavPage) => void;
  onOpenSettings: () => void;
}) {
  return (
    <>
      {/* ─── Desktop Sidebar ───────────────────────────────── */}
      <aside className="hidden shrink-0 lg:block">
        {collapsed ? (
          /* ── Collapsed ── */
          <div className="mt-3 ml-3 flex h-[calc(100dvh-24px)] w-[76px] flex-col items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-[var(--shadow-card)]">
            <LogoMark className="mt-1 h-9 w-9 shrink-0" />

            {/* AI Toolkit pill */}
            <button
              onClick={() => onNavigate("exams")}
              title="AI Teacher's Toolkit"
              className="grid h-10 w-10 place-items-center rounded-xl bg-ink-900 shadow-md ring-1 ring-brand-500/60 transition hover:ring-brand-500"
            >
              <IconSparkle className="h-4 w-4 text-brand-400" />
            </button>

            <div className="my-0.5 h-px w-8 rounded-full bg-line" />

            {/* Nav items */}
            <nav className="flex flex-col items-center gap-1">
              {NAV.map(({ icon: Icon, label, page }) => {
                const active = activePage === page;
                return (
                  <button
                    key={page}
                    title={label}
                    onClick={() => onNavigate(page)}
                    className={`relative grid h-10 w-10 place-items-center rounded-xl transition-all ${
                      active
                        ? "bg-brand-500/10 text-brand-600 shadow-sm"
                        : "text-ink-600 hover:bg-paper hover:text-ink-900"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 -translate-x-1.5 rounded-r-full bg-brand-500" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="flex-1" />

            <button
              onClick={onOpenSettings}
              title="Settings"
              className="grid h-10 w-10 place-items-center rounded-xl text-ink-500 transition hover:bg-paper hover:text-ink-900"
            >
              <IconSettings className="h-[18px] w-[18px]" />
            </button>

            {/* School badge */}
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-paper to-paper-dark text-lg shadow-inner">
              🏛️
            </div>

            {/* Expand button */}
            <button
              onClick={onToggle}
              title="Expand sidebar"
              className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink-500 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
            >
              <IconChevronsRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* ── Expanded ── */
          <div className="mt-3 ml-3 flex h-[calc(100dvh-24px)] w-[260px] flex-col rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-card)]">
            {/* Logo row */}
            <div className="flex items-center gap-2.5 px-1">
              <LogoMark className="h-9 w-9 shrink-0" />
              <span className="text-[19px] font-extrabold tracking-tight text-ink-900">VedaAI</span>
              <button
                onClick={onToggle}
                title="Collapse sidebar"
                className="ml-auto grid h-8 w-8 place-items-center rounded-full text-ink-500 transition hover:bg-paper hover:text-ink-900"
              >
                <IconPanel className="h-[18px] w-[18px]" />
              </button>
            </div>

            {/* AI Toolkit CTA */}
            <button
              onClick={() => onNavigate("exams")}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-ink-900 py-2.5 text-sm font-extrabold text-white shadow-md ring-1 ring-brand-500/50 transition hover:bg-ink-800 hover:ring-brand-500"
            >
              <IconSparkle className="h-3.5 w-3.5 text-brand-400" />
              AI Teacher&apos;s Toolkit
            </button>

            {/* Nav */}
            <nav className="mt-5 flex flex-col gap-0.5">
              <p className="mb-1 px-3 text-[10px] font-extrabold tracking-widest text-ink-400 uppercase">
                Navigation
              </p>
              {NAV.map(({ icon: Icon, label, page }) => {
                const active = activePage === page;
                return (
                  <button
                    key={page}
                    onClick={() => onNavigate(page)}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                      active
                        ? "bg-gradient-to-r from-brand-500/12 to-brand-500/4 text-ink-900"
                        : "text-ink-600 hover:bg-paper hover:text-ink-900"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-brand-500" />
                    )}
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 transition ${
                        active ? "text-brand-500" : "text-ink-500 group-hover:text-ink-900"
                      }`}
                    />
                    <span className="flex-1 text-left">{label}</span>
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500 opacity-80" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="flex-1" />

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-600 transition hover:bg-paper hover:text-ink-900"
            >
              <IconSettings className="h-[18px] w-[18px] shrink-0 text-ink-500" />
              Settings
            </button>

            {/* School card */}
            <div className="mt-2 flex items-center gap-3 rounded-xl bg-gradient-to-br from-paper to-paper-dark p-3 ring-1 ring-line">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-base shadow-sm ring-1 ring-line">
                🏛️
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-extrabold text-ink-900">Delhi Public School</div>
                <div className="truncate text-[11px] font-medium text-ink-500">Bokaro Steel City</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ─── Mobile Bottom Nav ─────────────────────────────── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-white/90 backdrop-blur-md pb-safe lg:hidden">
        {NAV.map(({ icon: Icon, label, page }) => {
          const active = activePage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[9px] font-extrabold uppercase tracking-wide transition ${
                active ? "text-brand-500" : "text-ink-400 hover:text-ink-700"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-brand-500" : ""}`} />
              {label.split(" ").slice(-1)[0]}
            </button>
          );
        })}
        <button
          onClick={onOpenSettings}
          className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[9px] font-extrabold uppercase tracking-wide text-ink-400 transition hover:text-ink-700"
        >
          <IconSettings className="h-5 w-5" />
          Settings
        </button>
      </nav>
    </>
  );
}
