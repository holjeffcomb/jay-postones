"use client";
import LeftColumn from "./_components/LeftColumn";
import RightColumn from "./_components/RightColumn";
import { Lesson } from "../../../../types/types";
import { components } from "./_components/RightColumn";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "../../../lib/sanityClient";
import { PortableText } from "@portabletext/react";
import {
  handleProgressUpdate,
  handleAddToPracticeList,
  fetchProgress,
  fetchUserId,
} from "@/app/utils/supabaseService";
import Image from "next/image";
import {
  Progress,
  ProgressList,
  Exercise,
  ExerciseType,
} from "../../../../types/types";

export default function LessonPage() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [userNotes, setUserNotes] = useState<string>(
    "enter your own notes here..."
  );
  const [exerciseContent, setExerciseContent] = useState<JSX.Element | null>(
    null
  );
  const [exerciseId, setExerciseId] = useState<string | null>(null);
  const params = useParams<{ id: string }>();
  const [isMarkCompleteLoading, setIsMarkCompleteLoading] =
    useState<boolean>(false);
  const [isTooDifficultLoading, setIsTooDifficultLoading] =
    useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>(
    []
  );
  const [difficultExerciseIds, setDifficultExerciseIds] = useState<string[]>(
    []
  );
  const [selectedExerciseTitle, setSelectedExerciseTitle] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchLesson = async () => {
      const fetchedLesson = await client.fetch<Lesson>(
        `*[_type == "lesson" && _id == "${params.id}"][0]`
      );

      setLesson(fetchedLesson);

      // Load the first exercise by default
      const firstExercise = fetchedLesson?.exercises?.[0];
      if (firstExercise) {
        setExerciseId(firstExercise.id);
        setSelectedExerciseTitle(firstExercise.title);
      }

      // Fetch current user, redirect to login if not found
      const userId = await fetchUserId();
      if (!userId) {
        redirect("/login");
      } else {
        setUserId(userId);
      }

      const progress = await fetchProgress(firstExercise.id, userId);
      if (!progress) {
        console.error("Progress not available");
      } else {
        setCompletedExerciseIds(returnCompletedExercises(progress));
        setDifficultExerciseIds(returnedDifficultExercises(progress));
      }

      if (firstExercise) {
        if (firstExercise.type === "portableText") {
          setExerciseContent(
            <div className="w-10/12 flex flex-col m-auto">
              <PortableText
                value={firstExercise.content || []}
                components={components}
              />
            </div>
          );
        } else if (firstExercise.type === "soundslice") {
          setExerciseContent(
            <iframe
              src={firstExercise.soundsliceUrl}
              width="100%"
              height="400"
              allowFullScreen
            ></iframe>
          );
        } else if (firstExercise.type === "video") {
          setExerciseContent(
            <iframe
              src={firstExercise.videoUrl?.replace(
                "https://vimeo.com/",
                "https://player.vimeo.com/video/"
              )}
              width="100%"
              height="480"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Exercise Video"
            />
          );
        }
      } else {
        setExerciseContent(<p>No exercises available for this lesson.</p>);
      }
    };

    fetchLesson();
  }, [params.id]);

  const returnCompletedExercises = (progressData: ProgressList): string[] => {
    return progressData
      .filter((progress: Progress) => progress.status === "complete")
      .map((progress: Progress) => progress.exercise_id);
  };

  const returnedDifficultExercises = (progressData: ProgressList): string[] => {
    return progressData
      .filter((progress: Progress) => progress.status === "too difficult")
      .map((progress: Progress) => progress.exercise_id);
  };

  const handleMarkComplete = async (exerciseId: string) => {
    setIsMarkCompleteLoading(true);
    // Add to completedExerciseIds

    // Update progress
    const progressUpdateResponse = await handleProgressUpdate(
      exerciseId,
      "complete"
    );

    if (!progressUpdateResponse.success) {
      console.error(progressUpdateResponse.error);
      alert("Failed to mark exercise as complete. Please try again later.");
    } else {
      // if success
      alert("Exercise marked as complete!");

      // Remove from difficultExerciseIds if it exists
      if (difficultExerciseIds.includes(exerciseId)) {
        setDifficultExerciseIds(
          difficultExerciseIds.filter((id) => id !== exerciseId)
        );
      }
      completedExerciseIds.push(exerciseId);
    }
    setIsMarkCompleteLoading(false);
  };

  const handleMarkTooDifficult = async (exerciseId: string) => {
    setIsTooDifficultLoading(true);
    const progressUpdateResponse = await handleProgressUpdate(
      exerciseId,
      "too difficult"
    );

    if (!progressUpdateResponse.success) {
      console.error(progressUpdateResponse.error);
      alert(
        "Failed to mark exercise as too difficult. Please try again later."
      );
    } else {
      alert("Exercise marked as too difficult!");

      // Remove from completedExerciseIds if it exists
      if (completedExerciseIds.includes(exerciseId)) {
        setCompletedExerciseIds(
          completedExerciseIds.filter((id) => id !== exerciseId)
        );
      }
      difficultExerciseIds.push(exerciseId);
    }

    setIsTooDifficultLoading(false);
  };

  return (
    <div className="flex flex-row items-center justify-center h-auto">
      {lesson ? (
        <div className="flex lg:flex-row flex-col justify-between w-full bg-gray-300 items-stretch">
          <LeftColumn
            lesson={lesson}
            exerciseContent={exerciseContent}
            exerciseId={exerciseId}
            selectedExerciseTitle={selectedExerciseTitle}
            setExerciseId={setExerciseId}
            handleMarkComplete={handleMarkComplete}
            handleMarkTooDifficult={handleMarkTooDifficult}
            isMarkCompleteLoading={isMarkCompleteLoading}
            isTooDifficultLoading={isTooDifficultLoading}
          />

          <RightColumn
            lesson={lesson}
            handleAddToPracticeList={handleAddToPracticeList}
            setExerciseId={setExerciseId}
            setSelectedExerciseTitle={setSelectedExerciseTitle}
            completedExerciseIds={completedExerciseIds}
            difficultExerciseIds={difficultExerciseIds}
            setExerciseContent={setExerciseContent}
            userNotes={userNotes}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
