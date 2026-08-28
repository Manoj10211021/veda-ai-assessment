import { NextResponse } from "next/server";
import { errorResponse, geminiJSON, HttpError } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const userKey = req.headers.get("x-user-api-key") ?? undefined;
    const body = await req.json();
    const questions = Array.isArray(body?.questions) ? body.questions : [];
    const segments = Array.isArray(body?.segments) ? body.segments : [];
    if (!questions.length) throw new HttpError(400, "No questions provided");

    const qJson = JSON.stringify(
      questions.map((q: any, i: number) => ({
        idx: i,
        label: String(q.label),
        text: String(q.text ?? "").slice(0, 500),
        max_marks: q.max_marks ?? null,
      }))
    );
    const sJson = JSON.stringify(
      segments.map((s: any) => ({
        id: String(s.id),
        label: String(s.label),
        page: s.page,
        text: String(s.text ?? "").slice(0, 700),
      }))
    );

    const prompt = `You are an expert exam grader. Below are (1) the extracted questions of a test and (2) answer segments extracted from ONE student's handwritten answer sheet (each segment has the label the student wrote plus a transcription).

QUESTIONS:
${qJson}

ANSWER SEGMENTS:
${sJson}

Tasks:
1. MAP every segment to the question it answers. The student may write "Q2", "2)", "2 b)", "(ii)", "Ans 3" etc. — match to the correct question or sub-part by number. Handle answers written out of order.
2. Grade each mapped answer out of its max_marks (use 2 when max_marks is null): judge correctness and completeness against the question text. Score may be 0 or fractional (0.5 steps).
3. Write short teacher-style feedback (1-2 sentences, encouraging, specific to what the student wrote). For unanswered questions: one short sentence noting it was not attempted. Keep every feedback string brief — with many questions, it is far more important that every question gets a result than that any single one gets a long explanation.
4. List segments that match NO question under "unmatched" with a short reason.
5. Write a 2-3 sentence "overall_summary" of the student's performance.

Every question must appear exactly once in "results" (in the same order as QUESTIONS, matched by label).

Return ONLY JSON in this exact shape:
{"results":[{"label":"1","status":"answered","segment_ids":["a1"],"score":2,"max_marks":2,"feedback":"...","confidence":0.95}],"unmatched":[{"id":"a9","label":"12","reason":"No question 12 in the paper"}],"overall_summary":"..."}`;

    const data = await geminiJSON({ prompt, userKey });
    return NextResponse.json(data);
  } catch (e) {
    return errorResponse(e);
  }
}