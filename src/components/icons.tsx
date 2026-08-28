import type { ReactNode } from "react";

type P = { className?: string };

function S({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function LogoMark({ className = "" }: P) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#17131A" />
      <path d="M10 13h5.1l4.9 12.3L24.9 13H30l-8 17h-4l-8-17z" fill="#fff" />
      <path
        d="M31.5 6c.5 2.6 1.8 3.9 4.4 4.4-2.6.5-3.9 1.8-4.4 4.4-.5-2.6-1.8-3.9-4.4-4.4 2.6-.5 3.9-1.8 4.4-4.4z"
        fill="#F4571F"
      />
    </svg>
  );
}

export function SparkleGlyph({ className = "" }: P) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <path
        d="M58 6c2.2 13.4 8.6 19.8 22 22-13.4 2.2-19.8 8.6-22 22-2.2-13.4-8.6-19.8-22-22 13.4-2.2 19.8-8.6 22-22z"
        fill="#F4571F"
      />
      <path
        d="M28 52c1.5 9 5.5 13 14.5 14.5C33.5 68 29.5 72 28 81c-1.5-9-5.5-13-14.5-14.5C22.5 65 26.5 61 28 52z"
        fill="#F4571F"
      />
      <circle cx="16" cy="30" r="4.5" fill="#F4571F" />
    </svg>
  );
}

export function IconSparkle({ className = "" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.5c.8 5.3 3.7 8.2 9 9-5.3.8-8.2 3.7-9 9-.8-5.3-3.7-8.2-9-9 5.3-.8 8.2-3.7 9-9z" />
    </svg>
  );
}

export function IconGrid({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
    </S>
  );
}

export function IconClassroom({ className = "" }: P) {
  return (
    <S className={className}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M12 16v4M8 20h8M7 8h6M7 11h4" />
    </S>
  );
}

export function IconAssignments({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </S>
  );
}

export function IconExams({ className = "" }: P) {
  return (
    <S className={className}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 2.5h6V6H9zM9 10h6M9 14h4" />
    </S>
  );
}

export function IconLibrary({ className = "" }: P) {
  return (
    <S className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v9l7.8 4.5" />
    </S>
  );
}

export function IconSettings({ className = "" }: P) {
  return (
    <S className={className}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </S>
  );
}

export function IconPanel({ className = "" }: P) {
  return (
    <S className={className}>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M15 4v16" />
    </S>
  );
}

export function IconChevronsRight({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M6 17l5-5-5-5M13 17l5-5-5-5" />
    </S>
  );
}

export function IconChevronsLeft({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M18 17l-5-5 5-5M11 17l-5-5 5-5" />
    </S>
  );
}

export function IconChevronDown({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M6 9l6 6 6-6" />
    </S>
  );
}

export function IconChevronLeft({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M15 6l-6 6 6 6" />
    </S>
  );
}

export function IconChevronRight({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M9 6l6 6-6 6" />
    </S>
  );
}

export function IconArrowLeft({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </S>
  );
}

export function IconArrowRight({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </S>
  );
}

export function IconUpload({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </S>
  );
}

export function IconX({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </S>
  );
}

export function IconPlus({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M12 5v14M5 12h14" />
    </S>
  );
}

export function IconMinus({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M5 12h14" />
    </S>
  );
}

export function IconCheck({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M5 13l4 4L19 7" />
    </S>
  );
}

export function IconHelp({ className = "" }: P) {
  return (
    <S className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.2a2.5 2.5 0 0 1 4.9.6c0 1.7-2.5 2.2-2.5 3.7M12 17h.01" />
    </S>
  );
}

export function IconBell({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M18 9a6 6 0 1 0-12 0c0 6.5-2.5 8-2.5 8h17S18 15.5 18 9" />
      <path d="M10.4 20.5a1.8 1.8 0 0 0 3.2 0" />
    </S>
  );
}

export function IconFolder({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2.3h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </S>
  );
}

export function IconMenu({ className = "" }: P) {
  return (
    <S className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </S>
  );
}

export function PdfBadge({ className = "" }: P) {
  return (
    <span
      className={
        "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#E5484D] text-[10px] font-extrabold tracking-wide text-white " +
        className
      }
    >
      PDF
    </span>
  );
}

export function ImgBadge({ className = "" }: P) {
  return (
    <span
      className={
        "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#3E7BFA] text-[10px] font-extrabold tracking-wide text-white " +
        className
      }
    >
      IMG
    </span>
  );
}
