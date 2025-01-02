export type Progress = {
  id: string;
  user_id: string;
  exercise_id: string;
  notes: string | null;
  status: string;
  updated_at: string; // ISO 8601 formatted date string
};

export type ProgressList = Progress[];
