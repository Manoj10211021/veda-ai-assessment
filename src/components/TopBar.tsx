"use client";

import { useEffect, useRef, useState } from "react";
import { getUserApiKey } from "@/lib/client";
import type { NavPage } from "./Sidebar";
import {
  IconArrowLeft,
  IconBell,
  IconChevronDown,
  IconFolder,
  IconHelp,
  IconMenu,
  IconSettings,
  IconSparkle,
} from "./icons";

const PAGE_LABELS: Record<NavPage, string> = {
  home: "Home",
  classroom: "My Classroom",
  assignments: "Assignments",
  exams: "Exams",
  library: "My Library",
};

const PAGE_ICONS: Record<NavPage, string> = {
  home: "⊞",
  classroom: "🏫",
  assignments: "📝",
  exams: "📋",
  library: "📚",
};

function Avatar({
  size = "h-8 w-8",
  text = "text-[11px]",
}: {
  size?: string;
  text?: string;
}) {
  return (
    <span
      className={`grid ${size} shrink-0 select-none place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 font-extrabold text-white shadow-sm ${text}`}
    >
      MR
    </span>
  );
}

function IconBtn({
  children,
  className = "",
  onClick,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={
        "relative grid h-9 w-9 place-items-center rounded-xl text-ink-600 transition hover:bg-paper hover:text-ink-900 " +
        className
      }
    >
      {children}
    </button>
  );
}

export function TopBar({
  activePage,
  onBack,
  onOpenSettings,
  onOpenMobileMenu,
  hasApiKey,
}: {
  activePage: NavPage;
  onBack?: () => void;
  onOpenSettings: () => void;
  onOpenMobileMenu?: () => void;
  hasApiKey: boolean;
}) {
  const [userOpen, setUserOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userOpen]);

  return (
    <header className="mx-3 mt-3 shrink-0">
      {/* ── API key warning banner ── */}
      {/* {!hasApiKey && (
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-warn-700/25 bg-warn-100 px-4 py-2 text-xs font-semibold text-warn-700 fade-in">
          <span className="shrink-0 text-sm">⚠️</span>
          <span>
            Using shared API key — you may hit rate limits.{" "}
            <button
              onClick={onOpenSettings}
              className="font-extrabold underline underline-offset-2 hover:no-underline"
            >
              Add your own key in Settings →
            </button>
          </span>
        </div>
      )} */}

      {/* ── Main topbar ── */}
      <div className="flex h-14 items-center gap-1 rounded-2xl border border-line bg-white px-2 shadow-[var(--shadow-card)]">
        {/* Back */}
        <button
          onClick={onBack}
          disabled={!onBack}
          aria-label="Back"
          className="grid h-9 w-9 place-items-center rounded-xl text-ink-700 transition hover:bg-paper disabled:opacity-25"
        >
          <IconArrowLeft className="h-[18px] w-[18px]" />
        </button>

        {/* Breadcrumb */}
        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="text-sm">{PAGE_ICONS[activePage]}</span>
          <span className="text-[15px] font-bold text-ink-900">
            {PAGE_LABELS[activePage]}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-0.5">
          <IconBtn className="hidden sm:grid" title="Help">
            <IconHelp className="h-[18px] w-[18px]" />
          </IconBtn>

          {/* Bell with badge */}
          <IconBtn title="Notifications">
            <IconBell className="h-[18px] w-[18px]" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500 ring-[1.5px] ring-white" />
          </IconBtn>

          <IconBtn className="hidden md:grid" title="AI Toolkit">
            <IconSparkle className="h-[18px] w-[18px] text-ink-900" />
          </IconBtn>

          {/* User dropdown */}
          <div ref={dropRef} className="relative hidden md:block">
            <button
              id="topbar-user-btn"
              onClick={() => setUserOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-paper"
            >
              <Avatar />
              <span className="text-[13px] font-bold text-ink-900">
                Madhur Rastogi
              </span>
              <IconChevronDown
                className={`h-3.5 w-3.5 text-ink-500 transition-transform duration-200 ${
                  userOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {userOpen && (
              <div className="slide-up absolute top-full right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-modal)]">
                {/* Profile header */}
                <div className="flex items-center gap-3 bg-gradient-to-br from-paper to-paper-dark px-4 py-3.5">
                  <Avatar size="h-10 w-10" text="text-sm" />
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-extrabold text-ink-900">
                      Madhur Rastogi
                    </div>
                    <div className="truncate text-[11px] font-medium text-ink-500">
                      Senior Teacher · DPS Bokaro
                    </div>
                  </div>
                </div>

                {/* Menu */}
                <div className="p-1.5">
                  {[
                    {
                      icon: "⚙️",
                      label: "Settings",
                      action: () => {
                        onOpenSettings();
                        setUserOpen(false);
                      },
                    },
                    {
                      icon: "🔑",
                      label: getUserApiKey() ? "Change API Key" : "Add API Key",
                      action: () => {
                        onOpenSettings();
                        setUserOpen(false);
                      },
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-ink-700 transition hover:bg-paper"
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}

                  <div className="my-1 mx-1 border-t border-line" />

                  <button
                    onClick={() => setUserOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-bad-600 transition hover:bg-bad-100"
                  >
                    <span>🚪</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile avatar */}
          <button
            className="md:hidden"
            onClick={() => {
              onOpenSettings();
            }}
            aria-label="User menu"
          >
            <Avatar size="h-8 w-8" text="text-[10px]" />
          </button>

          <IconBtn
            className="lg:hidden"
            title="Menu"
            onClick={onOpenMobileMenu}
          >
            <IconMenu className="h-[18px] w-[18px]" />
          </IconBtn>
        </div>
      </div>
    </header>
  );
}
