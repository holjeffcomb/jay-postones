"use client";
import ExerciseSection from "./_components/ExerciseSection";
import LessonSection from "./_components/LessonSection";
import { redirect, useParams } from "next/navigation";
import { LessonProvider, useLessonContext } from "./lessonContext";
import { useGlobalContext } from "@/app/_context/GlobalContext";
import { decideIfLocked } from "@/app/utils/helperFunctions";

export default function LessonPage() {
  const params = useParams<{ id: string }>();

  return (
    <LessonProvider lessonId={params.id}>
      <LessonContentWrapper />
    </LessonProvider>
  );
}

const LessonContentWrapper = () => {
  const { userId, isPageLoading, membershipLevel } = useLessonContext();

  const { user } = useGlobalContext();

  // Redirect if user is not logged in and not loading
  if (!userId && !isPageLoading) {
    redirect("/login");
  }

  // Redirect if user is not of the correct membership level
  if (decideIfLocked(user?.membershipLevel, membershipLevel)) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col flex-grow h-full w-full">
      <LessonContent />
    </div>
  );
};

const LessonContent = () => {
  return (
    <div className="flex flex-grow lg:flex-row flex-col justify-between items-stretch w-full h-full">
      <LessonSection />
      <ExerciseSection />
    </div>
  );
};
