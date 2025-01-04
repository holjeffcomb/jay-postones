"use client";
import ExerciseSection from "./_components/ExerciseSection";
import LessonSection from "./_components/LessonSection";
import { useParams } from "next/navigation";

import { handleAddToPracticeList } from "@/app/utils/supabaseService";

import { LessonProvider, useLessonContext } from "./lessonContext";

const LoadingDots = "/images/animations/loadingdots.svg";

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
  const {
    lesson,
    exerciseContent,
    handleMarkComplete,
    handleMarkTooDifficult,
    exerciseId,
    setExerciseId,
    selectedExerciseTitle,
    isMarkCompleteLoading,
    isTooDifficultLoading,
    setExerciseContent,
    setSelectedExerciseTitle,
    completedExerciseIds,
    difficultExerciseIds,
    userNotes,
  } = useLessonContext();

  if (!lesson) return <p>Loading...</p>;

  return (
    <div className="flex flex-grow lg:flex-row flex-col justify-between items-stretch w-full h-full">
      <ExerciseSection
        lesson={lesson}
        exerciseContent={exerciseContent}
        handleMarkComplete={handleMarkComplete}
        handleMarkTooDifficult={handleMarkTooDifficult}
        exerciseId={exerciseId}
        setExerciseId={setExerciseId}
        selectedExerciseTitle={selectedExerciseTitle}
        isMarkCompleteLoading={isMarkCompleteLoading}
        isTooDifficultLoading={isTooDifficultLoading}
      />
      <LessonSection
        lesson={lesson}
        handleAddToPracticeList={handleAddToPracticeList}
        setExerciseId={setExerciseId}
        setSelectedExerciseTitle={setSelectedExerciseTitle}
        setExerciseContent={setExerciseContent}
        completedExerciseIds={completedExerciseIds}
        difficultExerciseIds={difficultExerciseIds}
        userNotes={userNotes}
      />
    </div>
  );
};
