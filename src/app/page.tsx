"use client";

import { useCallback, useEffect, useState } from "react";
import { assembleAnalysis, mergeQuestions, mergeSegments } from "@/lib/assemble";
import { chunk, getUserApiKey, postJSON } from "@/lib/client";
import { filesToPageImages, getPdfPageCount } from "@/lib/pdf";
import type { AnalysisResult, PageImage } from "@/lib/types";
import { AssignmentsScreen } from "@/components/AssignmentsScreen";
import { ClassroomScreen } from "@/components/ClassroomScreen";
import { HomeScreen } from "@/components/HomeScreen";
import { LibraryScreen } from "@/components/LibraryScreen";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { SettingsModal } from "@/components/SettingsModal";
import { Sidebar, type NavPage } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { AS_MAX_PAGES, QP_MAX_PAGES, UploadScreen, type FileMetaT } from "@/components/UploadScreen";

type Stage = "upload" | "processing" | "results";

export default function Page() {
  const [activePage, setActivePage] = useState<NavPage>("exams");
  const [stage, setStage] = useState<Stage>("upload");
  const [qp, setQp] = useState<FileMetaT[]>([]);
  const [as, setAs] = useState<FileMetaT[]>([]);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [sheetPages, setSheetPages] = useState<PageImage[]>([]);
  const [pinOpen, setPinOpen] = useState<boolean | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

  // Check API key on mount and when settings change
  useEffect(() => {
    setHasApiKey(!!getUserApiKey());
  }, [settingsOpen]);

  const collapsed = pinOpen === null ? stage !== "upload" : !pinOpen;

  const navigate = useCallback((page: NavPage) => {
    setActivePage(page);
    // Reset exam stage if navigating away from exams
    if (page !== "exams") {
      // keep exam state so user can come back
    }
  }, []);

  const addFiles = useCallback(
    async (side: "qp" | "as", list: FileList | null) => {
      if (!list || !list.length) return;
      const incoming = Array.from(list).filter(
        (f) => f.type === "application/pdf" || f.type.startsWith("image/")
      );
      if (!incoming.length) {
        setError("Please upload PDF or image files only.");
        return;
      }
      const tooBig = incoming.find((f) => f.size > 10 * 1024 * 1024);
      if (tooBig) {
        setError(`"${tooBig.name}" is larger than 10MB.`);
        return;
      }
      setError(null);
      const setter = side === "qp" ? setQp : setAs;
      for (const f of incoming) {
        const id = crypto.randomUUID();
        setter((prev) => [...prev, { id, file: f, pages: 0 }]);
        try {
          const pages =
            f.type === "application/pdf" ? await getPdfPageCount(f) : 1;
          setter((prev) => prev.map((m) => (m.id === id ? { ...m, pages } : m)));
        } catch (e: any) {
          setter((prev) => prev.filter((m) => m.id !== id));
          setError(e?.message ?? `Could not read "${f.name}".`);
        }
      }
    },
    []
  );

  const removeFile = useCallback((side: "qp" | "as", id: string) => {
    const setter = side === "qp" ? setQp : setAs;
    setter((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setStage("processing");
    setStep(0);
    try {
      const qImgs = await filesToPageImages(
        qp.map((m) => m.file),
        QP_MAX_PAGES
      );
      if (!qImgs.length) throw new Error("Could not read any pages from the question paper.");

      const qResps = await Promise.all(
        chunk(qImgs, 6).map((b) =>
          postJSON("/api/extract-questions", {
            images: b.map((p) => p.dataUrl),
            startPage: b[0].index,
          })
        )
      );
      const questions = mergeQuestions(qResps);
      if (!questions.length)
        throw new Error(
          "No questions could be detected in the question paper. Try a clearer scan."
        );

      setStep(1);
      const aImgs = await filesToPageImages(
        as.map((m) => m.file),
        AS_MAX_PAGES
      );
      if (!aImgs.length) throw new Error("Could not read any pages from the answer sheet.");

      const aResps = await Promise.all(
        chunk(aImgs, 5).map((b) =>
          postJSON("/api/extract-answers", {
            images: b.map((p) => p.dataUrl),
            startPage: b[0].index,
          })
        )
      );
      const segments = mergeSegments(aResps, aImgs.length);

      setStep(2);
      const mapResp = await postJSON("/api/map-grade", { questions, segments });
      const result = assembleAnalysis(questions, segments, mapResp);

      setSheetPages(aImgs);
      setAnalysis(result);
      setStage("results");
    } catch (e: any) {
      const msg: string = e?.message ?? "Something went wrong while processing.";
      // Hint user to add their own key on rate-limit / key errors
      const isKeyErr =
        msg.includes("rate limit") ||
        msg.includes("API key") ||
        msg.includes("quota") ||
        msg.includes("configured");
      setError(
        isKeyErr
          ? `${msg} → Open Settings to add your own Gemini API key.`
          : msg
      );
      setStage("upload");
    }
  }, [qp, as]);

  const back = useCallback(() => {
    setStage("upload");
  }, []);

  // Show exam sub-stage when activePage === "exams"
  const showExamContent = activePage === "exams";

  return (
    <div className="flex h-dvh overflow-hidden bg-paper">
      <Sidebar
        collapsed={collapsed}
        activePage={activePage}
        onToggle={() => setPinOpen(!collapsed)}
        onNavigate={navigate}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex min-w-0 flex-1 flex-col pb-14 lg:pb-0">
        <TopBar
          activePage={activePage}
          onBack={showExamContent && stage === "results" ? back : undefined}
          onOpenSettings={() => setSettingsOpen(true)}
          hasApiKey={hasApiKey}
        />

        <main className="min-h-0 flex-1 overflow-hidden">
          {activePage === "home" && (
            <HomeScreen onNavigate={(p) => setActivePage(p as NavPage)} />
          )}
          {activePage === "classroom" && <ClassroomScreen />}
          {activePage === "assignments" && <AssignmentsScreen />}
          {activePage === "library" && <LibraryScreen />}

          {showExamContent && (
            <>
              {stage === "upload" && (
                <UploadScreen
                  qp={qp}
                  as={as}
                  onAdd={addFiles}
                  onRemove={removeFile}
                  onStart={start}
                  error={error}
                />
              )}
              {stage === "processing" && <LoadingScreen step={step} />}
              {stage === "results" && analysis && (
                <ResultsScreen analysis={analysis} pages={sheetPages} />
              )}
            </>
          )}
        </main>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onApiKeyChange={() => setHasApiKey(!!getUserApiKey())}
      />
    </div>
  );
}
