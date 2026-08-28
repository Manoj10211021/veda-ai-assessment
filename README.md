# VedaAI Assessment Mapper

VedaAI Assessment Mapper is an AI-assisted teacher toolkit for reviewing handwritten examinations. Upload a question paper and a student answer sheet, and the application uses Gemini vision models to extract questions, read answer regions, map answers to questions, assign marks, and generate teacher-style feedback.

The review workspace keeps the original answer sheet visible. Selecting a question highlights the detected answer region, making it easier for a teacher to verify the AI's interpretation against the student's actual handwriting.

## Links

- GitHub: <https://github.com/Manoj10211021/veda-ai-assessment>
- Live: <https://veda-ai-assessment-rouge.vercel.app/>

## Features

### Question-paper extraction

- Extracts every question in printed order.
- Preserves the original question numbering.
- Splits labelled sub-parts such as `11 (a)` and `11 (b)` into separate entries.
- Captures question text, printed marks, and visible section names.
- Preserves multiple-choice options when they appear in the paper.

### Handwritten-answer extraction

- Accepts PDF files and common image formats.
- Detects answer segments from scanned or photographed answer sheets.
- Records the student's written label and an AI transcription.
- Stores normalized `0-1000` bounding boxes for each answer region.
- Supports answers that continue across multiple pages.

### Mapping and grading

- Maps answers to questions even when answers are out of order.
- Recognizes common numbering formats such as `Q2`, `2)`, `2(b)`, and roman-numeral sub-parts.
- Grades answers using each question's maximum marks.
- Identifies unanswered questions.
- Flags answer segments that cannot be matched to a question.
- Generates per-question feedback and an overall assessment summary.

### Interactive review

- Displays the question list and answer-sheet pages together.
- Highlights the exact answer region associated with a selected question.
- Uses green highlights for matched answers and red dashed boxes for unmatched answers.
- Supports page navigation and zoom in the answer-sheet viewer.
- Keeps uploaded files and analysis state in the browser for the current session.

### Current navigation behavior

The application currently opens the Exams workflow for every navigation item. Home, My Classroom, Assignments, and My Library screens remain in the codebase for future expansion, but clicking any of them routes back to Exams so the active product flow is the exam-review workflow.

## How It Works

```text
Question paper PDF/images
          |
          v
Client-side page rendering with pdfjs-dist
          |
          v
POST /api/extract-questions
          |
          v
Student answer-sheet PDF/images
          |
          v
Client-side page rendering with pdfjs-dist
          |
          v
POST /api/extract-answers
          |
          v
POST /api/map-grade
          |
          v
Interactive results and answer-region highlights
```

The browser rasterizes PDFs into compressed page images. The server-side API routes send those images to Gemini and return structured JSON. No uploaded document is written to a database or stored on the server by the application.

## Technology Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS v4
- `pdfjs-dist` for client-side PDF rendering
- Google Gemini vision models through the Gemini REST API
- Node.js runtime for API routes
- Vercel-compatible deployment

## Project Structure

```text
ai-assessment-mapper/
├── assets/                       # Screenshots and product assets
├── data/                         # Sample question papers and answer sheets
├── public/
│   └── pdf.worker.min.mjs        # PDF.js worker copied during install
├── scripts/
│   └── copy-worker.mjs           # Copies the PDF.js worker into public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── extract-answers/  # Handwriting and answer-region extraction
│   │   │   ├── extract-questions/# Printed question extraction
│   │   │   └── map-grade/        # Mapping, grading, and feedback
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx              # Main client workflow and state
│   ├── components/               # Upload, navigation, review, and settings UI
│   └── lib/
│       ├── assemble.ts           # Combines extraction and grading responses
│       ├── client.ts             # Browser storage and API helpers
│       ├── gemini.ts             # Gemini request and response handling
│       ├── normalize.ts          # Label and answer normalization
│       ├── pdf.ts                # PDF/image conversion utilities
│       └── types.ts              # Shared TypeScript models
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Requirements

- Node.js 20 or newer. Node.js 22 is recommended.
- npm 10 or newer.
- A Google Gemini API key with access to a supported generative model.
- A modern browser with JavaScript enabled.

## Local Setup

1. Clone the repository and enter the application directory:

   ```bash
   git clone https://github.com/Manoj10211021/veda-ai-assessment.git
   cd veda-ai-assessment/ai-assessment-mapper
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   The `postinstall` script also copies the PDF.js worker into `public/`.

3. Create `.env.local` in the project directory:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-3.6-flash
   ```

   `GEMINI_MODEL` is optional. If omitted, the application defaults to `gemini-3.6-flash`.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open <http://localhost:3000>.

Never commit `.env`, `.env.local`, or any file containing an API key. These paths are excluded by `.gitignore`.

## Using the Application

1. Open the Exams workflow.
2. Upload one or more question-paper PDFs or images.
3. Upload one or more student answer-sheet PDFs or images.
4. Review the detected files and start analysis.
5. Wait for the three processing stages:
   - Extracting questions
   - Reading handwritten answers
   - Mapping and grading answers
6. Review marks, feedback, unanswered questions, and unmatched answers.
7. Select a question to jump to and highlight its answer region on the answer sheet.

You may also enter a personal Gemini API key in Settings. A key entered in Settings is stored only in the browser's local storage and is sent to the app through the `x-user-api-key` request header. It takes priority over the server-side `GEMINI_API_KEY`.

## Configuration

| Variable         | Required                  | Description                                        |
| ---------------- | ------------------------- | -------------------------------------------------- |
| `GEMINI_API_KEY` | Yes for server processing | Default Gemini API key used by the API routes.     |
| `GEMINI_MODEL`   | No                        | Gemini model name. Defaults to `gemini-3.6-flash`. |

The application uses the Gemini `generateContent` REST endpoint at:

```text
https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
```

The current implementation uses structured JSON response mode. The provider may recommend the Interactions API for newer integrations; adopting it would require a separate request and response-handling migration.

## API Routes

### `POST /api/extract-questions`

Extracts printed questions from consecutive page images.

Example request shape:

```json
{
  "images": ["data:image/jpeg;base64,..."],
  "startPage": 1
}
```

Returns a JSON object containing a `questions` array with labels, text, marks, sections, and sub-part information.

### `POST /api/extract-answers`

Detects handwritten answer segments and their normalized regions.

Example request shape:

```json
{
  "images": ["data:image/jpeg;base64,..."],
  "startPage": 1
}
```

Returns answer segments containing page numbers, labels, transcriptions, and `box_2d` coordinates.

### `POST /api/map-grade`

Maps extracted answer segments to extracted questions and returns grades, feedback, unmatched segments, and an overall summary.

## Upload Limits and Processing Limits

- Maximum individual file size: 10 MB.
- Question paper processing limit: first 12 pages.
- Answer sheet processing limit: first 16 pages.
- Question extraction batches: up to 6 page images per request.
- Answer extraction batches: up to 5 page images per request.
- Default marks when no printed marks are found: 2.
- API request timeout: approximately 55 seconds per Gemini request.

Large files, low-resolution scans, severe skew, shadows, and difficult handwriting can reduce extraction and highlighting accuracy.

## Production Build

Run a production build locally:

```bash
npm run build
```

Start the compiled application:

```bash
npm run start
```

The available npm scripts are:

| Script          | Purpose                                          |
| --------------- | ------------------------------------------------ |
| `npm run dev`   | Start the Next.js development server.            |
| `npm run build` | Create an optimized production build.            |
| `npm run start` | Serve the production build.                      |
| `npm install`   | Install dependencies and copy the PDF.js worker. |

## Deploying to Vercel

### Vercel dashboard

1. Import the GitHub repository into Vercel.
2. Set the project root directory to `ai-assessment-mapper` if you imported the outer repository folder.
3. Keep the framework preset as Next.js.
4. Add `GEMINI_API_KEY` under Project Settings → Environment Variables.
5. Optionally add `GEMINI_MODEL` with the value `gemini-3.6-flash`.
6. Deploy and open the generated Vercel URL.

### Vercel CLI

From the application directory:

```bash
npm install
npx vercel login
npx vercel --prod
```

When prompted, create a new Vercel project for this application. Do not link it to an unrelated project with a different root directory. Add the production environment variables in Vercel before testing AI processing.

## Privacy and Security

- Uploaded files are processed in browser memory and are not persisted by this application.
- The server sends page images to Google Gemini for extraction and grading.
- The server-side API key is never embedded in client JavaScript.
- Personal keys entered in Settings are stored in browser local storage.
- Do not upload confidential examination material unless your institution permits processing through the configured AI provider.
- Never expose API keys in screenshots, source files, Git commits, or public issue reports.

## Limitations

This tool is an AI-assisted review aid, not an autonomous examination authority. Teachers should verify extracted text, answer-to-question mapping, marks, and feedback before using results for official assessment.

Accuracy may be affected by:

- Unclear scans or photographs
- Heavy shadows, page folds, or skewed pages
- Very small or unusual handwriting
- Answers written without recognizable labels
- Complex diagrams, tables, or mathematical notation
- Questions or answers split across unusual page layouts
- Gemini rate limits, model availability, or transient API failures

## Troubleshooting

### `GEMINI_API_KEY is not configured`

Create `.env.local` in the application directory, add the key, and restart the development server. Environment changes are not reliably applied to an already-running process.

### `Request contains an invalid argument`

Confirm that `GEMINI_MODEL` names a model available to your API key. The application defaults to `gemini-3.6-flash` and omits zero-valued thinking configuration because newer models reject that request field.

### `429` or rate-limit errors

Wait and retry, reduce the number of pages, or enter your own Gemini API key through Settings. Confirm that the key has the required quota and model access.

### Vercel reports that a path such as `frontend` does not exist

The Vercel project is configured with the wrong Root Directory. Set it to `ai-assessment-mapper` when deploying from the outer repository folder, or deploy directly from the application directory.

### PDF pages do not render

Run `npm install` again so the `postinstall` script copies `pdf.worker.min.mjs` into `public/`. Then restart the development server and reload the browser.

<!-- ## License

This repository does not currently declare an open-source license. Contact the repository owner before redistributing or using it in a commercial product. -->
