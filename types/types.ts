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
  downloadableFiles?: {
    asset: { _ref: string; url: string; originalFilename: string };
  }[]; // Updated to an array
  exercises: Exercise[];
  imageUrl: string;
  membershipLevel: string;
  subtitle: string;
  level: "beginner" | "intermediate" | "advanced" | "all";
  tags: string[];
  summary: string;
};

export type GridItem = {
  _id: string;
  title: string;
  description: string;
  fullDescription: string;
  sticking?: string;
  tempo?: string;
  timeSignature?: string;
  videoUrl?: string;
  downloadableFile?: { asset: { _ref: string } };
  exercises: Exercise[];
  imageUrl: string;
  membershipLevel: string;
  subtitle: string;
  level: "beginner" | "intermediate" | "advanced" | "all";
  tags: string[];
  summary: string;
  lessons?: Lesson[];
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

export type User = {
  firstName: string;
  lastName: string;
};
