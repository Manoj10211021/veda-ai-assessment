import type { PageImage } from "./types";

const MAX_DIM = 1400;
const QUALITY = 0.72;

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

export async function getPdfPageCount(file: File): Promise<number> {
  const pdfjs = await loadPdfjs();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const n = doc.numPages;
  await doc.destroy();
  return n;
}

export async function countPages(files: File[]): Promise<number> {
  let total = 0;
  for (const f of files) {
    if (f.type === "application/pdf") {
      try {
        total += await getPdfPageCount(f);
      } catch {
        throw new Error(`Could not read "${f.name}" as a PDF.`);
      }
    } else if (f.type.startsWith("image/")) {
      total += 1;
    }
  }
  return total;
}

export async function filesToPageImages(files: File[], maxPages: number): Promise<PageImage[]> {
  const pages: PageImage[] = [];
  let index = 1;
  for (const file of files) {
    if (pages.length >= maxPages) break;
    if (file.type === "application/pdf") {
      const pdfjs = await loadPdfjs();
      const doc = await pdfjs.getDocument({
        data: new Uint8Array(await file.arrayBuffer()),
      }).promise;
      const count = Math.min(doc.numPages, maxPages - pages.length);
      for (let i = 1; i <= count; i++) {
        const page = await doc.getPage(i);
        const vp1 = page.getViewport({ scale: 1 });
        const scale = Math.min(2, MAX_DIM / Math.max(vp1.width, vp1.height));
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        pages.push({ index: index++, dataUrl: canvas.toDataURL("image/jpeg", QUALITY) });
      }
      await doc.destroy();
    } else if (file.type.startsWith("image/")) {
      const bitmap = await createImageBitmap(file);
      const long = Math.max(bitmap.width, bitmap.height);
      const s = Math.min(1, MAX_DIM / long);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * s));
      canvas.height = Math.max(1, Math.round(bitmap.height * s));
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      pages.push({ index: index++, dataUrl: canvas.toDataURL("image/jpeg", QUALITY) });
    }
  }
  return pages;
}
