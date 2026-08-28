export type PageImage = { index: number; dataUrl: string };

export type Question = {
  label: string;
  number: string;
  sub_part?: string | null;
  text: string;
  max_marks: number | null;
  section?: string | null;
};

export type Segment = {
  id: string;
  label: string;
  page: number;
  box_2d: [number, number, number, number];
  text: string;
};

export type MapResult = {
  label: string;
  key: string;
  status: "answered" | "unanswered";
  segment_ids: string[];
  score: number;
  max_marks: number;
  feedback: string;
  confidence?: number;
};

export type Unmatched = {
  id: string;
  label: string;
  page: number;
  text: string;
  reason: string;
};

export type AnalysisResult = {
  questions: Question[];
  segments: Segment[];
  results: MapResult[];
  unmatched: Unmatched[];
  overall_summary: string;
};
