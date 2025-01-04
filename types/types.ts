// import { LayoutProps } from "./../.next/types/app/api/getLatestLesson/route";
import { PortableTextBlock } from "@portabletext/react";
export type Progress = {
  id: string;
  user_id: string;
  exercise_id: string;
  notes: string | null;
  status: string;
  updated_at: string; // ISO 8601 formatted date string
};

export type ProgressList = Progress[];

export type Lesson = {
  _id: string;
  title: string;
  description: string;
  sticking?: string;
  tempo?: string;
  timeSignature?: string;
  videoUrl?: string;
  downloadableFile?: { asset: { _ref: string } };
  exercises: Exercise[];
};

export type ExerciseType = "portableText" | "video" | "soundslice";

// Type for each exercise
export type Exercise = {
  id: string;
  type: ExerciseType;
  title: string;
  videoUrl?: string;
  soundsliceUrl?: string;
  content?: PortableTextBlock[]; // PortableText content type
};
