"use client";

import { useEffect, useRef, useState } from "react";
import { getUserApiKey, setUserApiKey } from "@/lib/client";
import { IconCheck, IconSettings, IconX } from "./icons";

type Tab = "api" | "profile" | "preferences";

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4.5 w-4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );
}

export function SettingsModal({
  open,
  onClose,
  onApiKeyChange,
}: {
  open: boolean;
  onClose: () => void;
  onApiKeyChange?: () => void;
}) {
  const [tab, setTab] = useState<Tab>("api");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Load current key on open
  useEffect(() => {
    if (open) {
      setApiKey(getUserApiKey());
      setSaved(false);
    }
  }, [open]);

  // Load preference
  useEffect(() => {
    const pref = localStorage.getItem("veda_sidebar_collapsed");
    if (pref !== null) setCollapsed(pref === "true");
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSaveKey = () => {
    setUserApiKey(apiKey);
    setSaved(true);
    onApiKeyChange?.();
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClearKey = () => {
    setUserApiKey("");
    setApiKey("");
    onApiKeyChange?.();
  };

  const handleSavePrefs = () => {
    localStorage.setItem("veda_sidebar_collapsed", String(collapsed));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-2xl"
        style={{ maxHeight: "min(90dvh, 680px)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-line px-6 py-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink-900 text-white">
            <IconSettings className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold">Settings</h2>
            <p className="text-xs font-medium text-ink-600">
              Configure VedaAI to your preference
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="ml-auto grid h-9 w-9 place-items-center rounded-full text-ink-600 transition hover:bg-paper"
          >
            <IconX className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Sidebar tabs */}
          <nav className="flex w-44 shrink-0 flex-col gap-1 border-r border-line bg-paper/60 p-3">
            {(
              [
                { id: "api", label: "API Configuration", icon: "🔑" },
                { id: "profile", label: "Profile", icon: "👤" },
                { id: "preferences", label: "Preferences", icon: "⚙️" },
              ] as { id: Tab; label: string; icon: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                  tab === t.id
                    ? "bg-white text-ink-900 shadow-sm"
                    : "text-ink-600 hover:bg-white/60"
                }`}
              >
                <span>{t.icon}</span>
                <span className="text-xs leading-tight">{t.label}</span>
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {tab === "api" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold">Gemini API Key</h3>
                  <p className="mt-1 text-sm text-ink-600">
                    VedaAI uses Google Gemini to extract questions, read
                    handwriting, and grade answers. A default key is
                    pre-configured, but if you hit rate limits you can add your
                    own — it takes priority.
                  </p>
                </div>

                {/* Key input */}
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-ink-700">
                    Your Gemini API Key
                  </label>
                  <div className="relative">
                    <input
                      id="settings-api-key"
                      type={showKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        setSaved(false);
                      }}
                      placeholder="AIza…"
                      className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 pr-12 font-mono text-sm text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((v) => !v)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-600 transition hover:text-ink-900"
                      aria-label={showKey ? "Hide key" : "Show key"}
                    >
                      <EyeIcon open={showKey} />
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-ink-600">
                    Get a free key at{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-brand-600 hover:underline"
                    >
                      aistudio.google.com
                    </a>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleSaveKey}
                    className="flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-black"
                  >
                    {saved ? <IconCheck className="h-4 w-4" /> : null}
                    {saved ? "Saved!" : "Save Key"}
                  </button>
                  {apiKey && (
                    <button
                      onClick={handleClearKey}
                      className="rounded-full border border-bad-600/30 px-5 py-2.5 text-sm font-bold text-bad-600 transition hover:bg-bad-100"
                    >
                      Clear Key
                    </button>
                  )}
                </div>

                {/* Status pill */}
                <div
                  className={`flex items-center gap-2.5 rounded-2xl p-4 text-sm font-semibold ${
                    getUserApiKey()
                      ? "bg-good-100 text-good-600"
                      : "bg-warn-100 text-warn-700"
                  }`}
                >
                  <span className="text-lg">
                    {getUserApiKey() ? "✅" : "⚠️"}
                  </span>
                  {getUserApiKey()
                    ? "Custom API key is active — this key takes priority over the default."
                    : "Using the default shared API key. Add your own key to avoid rate limits."}
                </div>

                {/* Model selector */}
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-ink-700">
                    Gemini Model
                  </label>
                  <select
                    disabled
                    defaultValue="gemini-3.6-flash"
                    className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-medium text-ink-700 opacity-60"
                  >
                    <option value="gemini-3.6-flash">
                      gemini-3.6-flash (default, fast)
                    </option>
                    <option value="gemini-2.5-pro">
                      gemini-2.5-pro (slower, more accurate)
                    </option>
                  </select>
                  <p className="mt-1 text-xs text-ink-400">
                    Model selection coming soon
                  </p>
                </div>
              </div>
            )}

            {tab === "profile" && (
              <div className="space-y-6">
                <h3 className="text-base font-extrabold">Your Profile</h3>
                <div className="flex items-center gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-300 to-brand-600 text-2xl font-extrabold text-white">
                    MR
                  </div>
                  <div>
                    <div className="text-lg font-extrabold">Madhur Rastogi</div>
                    <div className="text-sm text-ink-600">
                      Senior Teacher · Science Dept.
                    </div>
                  </div>
                </div>

                {[
                  { label: "Full Name", value: "Madhur Rastogi" },
                  { label: "Email", value: "madhur.rastogi@dpsbokaro.in" },
                  { label: "Role", value: "Senior Teacher" },
                  {
                    label: "Institution",
                    value: "Delhi Public School, Bokaro Steel City",
                  },
                  { label: "Department", value: "Science & Mathematics" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-600">
                      {f.label}
                    </label>
                    <div className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-medium text-ink-900">
                      {f.value}
                    </div>
                  </div>
                ))}
                <p className="text-xs text-ink-400">
                  Profile editing will be available in a future update.
                </p>
              </div>
            )}

            {tab === "preferences" && (
              <div className="space-y-6">
                <h3 className="text-base font-extrabold">App Preferences</h3>

                <div className="flex items-center justify-between rounded-2xl border border-line bg-paper/60 p-4">
                  <div>
                    <div className="text-sm font-bold">
                      Sidebar collapsed by default
                    </div>
                    <div className="text-xs text-ink-600">
                      Start with the sidebar in its compact icon-only view
                    </div>
                  </div>
                  <button
                    onClick={() => setCollapsed((v) => !v)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      collapsed ? "bg-brand-500" : "bg-line"
                    }`}
                    role="switch"
                    aria-checked={collapsed}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        collapsed ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={handleSavePrefs}
                  className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-black"
                >
                  Save Preferences
                </button>

                <div className="rounded-2xl border border-dashed border-ink-400/30 bg-paper/60 p-4 text-center">
                  <p className="text-xs font-semibold text-ink-400">
                    More preference options coming soon — theme, language,
                    notification settings
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
