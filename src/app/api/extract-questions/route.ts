import { NextResponse } from "next/server";
import { errorResponse, geminiJSON, HttpError } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const userKey = req.headers.get("x-user-api-key") ?? undefined;
    const body = await req.json();
    const images: string[] = Array.isArray(body?.images) ? body.images : [];
    const startPage = Math.max(1, Math.round(Number(body?.startPage) || 1));
    const endPage = startPage + images.length - 1;
    if (!images.length) throw new HttpError(400, "No page images provided");

    const prompt = `You are an expert at parsing printed exam question papers from page images.
The images are consecutive pages ${startPage} to ${endPage} of ONE question paper, given in order.

Extract EVERY question EXACTLY in the printed order.

Rules:
- Preserve the original numbering exactly as printed (e.g. "1", "2", "11"). Do NOT renumber or skip.
- Treat labelled sub-parts as SEPARATE entries: "11 (a)" and "11 (b)" become two entries with label "11a" and "11b" (number "11", sub_part "a"/"b"). Same for i), ii), (I), (II) -> labels like "11i", "11ii".
- Transcribe the full question text verbatim, including MCQ options (A)/(B)/(C)/(D) if present.
- max_marks: the marks printed for that question (number). null if not printed anywhere for it.
- section: the section letter/name it belongs to (e.g. "A", "B") if visible, else null.
- Ignore instructions, headers, student name fields, and marking scheme text.

Return ONLY JSON in this exact shape:
{"questions":[{"label":"1","number":"1","sub_part":null,"text":"...","max_marks":2,"section":"A"}]}`;

    const data = await geminiJSON({ prompt, images, thinkingBudget: 0, userKey });
    return NextResponse.json(data);
  } catch (e) {
    return errorResponse(e);
  }
}
