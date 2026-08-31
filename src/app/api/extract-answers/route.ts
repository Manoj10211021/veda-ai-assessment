import { NextResponse } from "next/server";
import { errorResponse, geminiJSON, HttpError } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const userKey = req.headers.get("x-user-api-key") ?? undefined;
    const body = await req.json();
    const images: string[] = Array.isArray(body?.images) ? body.images : [];
    const startPage = Math.max(1, Math.round(Number(body?.startPage) || 1));
    const endPage = startPage + images.length - 1;
    if (!images.length) throw new HttpError(400, "No page images provided");

    const prompt = `You are an expert at analysing scanned handwritten student answer sheets.
The images are consecutive pages ${startPage} to ${endPage} of ONE student's answer sheet, given in order.

For EVERY answer the student has written, output ONE segment:
- label: the question number as the student wrote it (e.g. "1", "2", "2b", "3(a)", "Q4", "ii"). Keep the number and sub-part.
- page: the page number this segment is on (use the page numbers ${startPage} to ${endPage}).
- box_2d: [ymin, xmin, ymax, xmax] normalised to 0-1000 relative to THAT page's image — a TIGHT rectangle enclosing the ENTIRE answer for that question: include the written question number and every line, formula, diagram and working, from the question label until the next question's label begins. Do not cut off any part of the answer.
- text: transcribe the handwritten content of the answer. Keep transcriptions concise — capture the full meaning but do not pad with filler; this keeps the response short enough to avoid truncation when a page has many answers.

Rules:
- If an answer clearly continues after a page break (same question continuing on a later page), output ANOTHER segment with the same label for the continued part (it will be merged).
- Never merge two different questions into one segment.
- Ignore non-answer content: page headers, student name fields, margins, ruled lines, teacher marks.
- If a single page contains many short answers, keep every "text" field brief so the FULL list of segments fits in the response — it is far more important to return every segment than to give a verbose transcription of any one of them.

Return ONLY JSON in this exact shape:
{"segments":[{"id":"a1","label":"1","page":1,"box_2d":[ymin,xmin,ymax,xmax],"text":"..."}]}`;

    const data = await geminiJSON({ prompt, images, thinkingBudget: 0, userKey });
    return NextResponse.json(data);
  } catch (e) {
    return errorResponse(e);
  }
}