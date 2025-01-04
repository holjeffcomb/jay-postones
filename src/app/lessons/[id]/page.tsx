"use client";
import ExerciseSection from "./_components/ExerciseSection";
import LessonSection from "./_components/LessonSection";
import { useParams } from "next/navigation";
import { LessonProvider, useLessonContext } from "./lessonContext";

export default function LessonPage() {
  const params = useParams<{ id: string }>();

  return (
    <LessonProvider lessonId={params.id}>
      <div className="flex flex-col flex-grow h-full w-full">
        <LessonContent />
      </div>
    </LessonProvider>
  );
}

const LessonContent = () => {
  return (
    <div className="flex flex-grow lg:flex-row flex-col justify-between items-stretch w-full h-full">
      <ExerciseSection />
      <LessonSection />
    </div>
  );
};
