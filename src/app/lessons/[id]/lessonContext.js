import { createContext, useContext, useState, useEffect } from "react";
import { client } from "../../../lib/sanityClient";
import {
  fetchProgress,
  fetchUserId,
  handleProgressUpdate,
} from "@/app/utils/supabaseService";
import { PortableText } from "@portabletext/react";

const LessonContext = createContext();

export const LessonProvider = ({ children, lessonId }) => {
  const [lesson, setLesson] = useState(null);
  const [userNotes, setUserNotes] = useState("enter your own notes here...");
  const [exerciseContent, setExerciseContent] = useState(null);
  const [exerciseId, setExerciseId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [completedExerciseIds, setCompletedExerciseIds] = useState([]);
  const [difficultExerciseIds, setDifficultExerciseIds] = useState([]);
  const [selectedExerciseTitle, setSelectedExerciseTitle] = useState(null);
  const [isMarkCompleteLoading, setIsMarkCompleteLoading] = useState(false);
  const [isTooDifficultLoading, setIsTooDifficultLoading] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      const fetchedLesson = await client.fetch(
        `*[_type == "lesson" && _id == "${lessonId}"][0]`
      );

      setLesson(fetchedLesson);

      const firstExercise = fetchedLesson?.exercises?.[0];
      if (firstExercise) {
        setExerciseId(firstExercise.id);
        setSelectedExerciseTitle(firstExercise.title);
        loadExerciseContent(firstExercise);
      }

      const userId = await fetchUserId();
      if (!userId) {
        redirect("/login");
      } else {
        setUserId(userId);
      }

      const progress = await fetchProgress(firstExercise.id, userId);
      setCompletedExerciseIds(returnCompletedExercises(progress));
      setDifficultExerciseIds(returnDifficultExercises(progress));
    };

    fetchLesson();
  }, [lessonId]);

  const loadExerciseContent = (exercise) => {
    if (exercise.type === "portableText") {
      setExerciseContent(
        <div className="w-10/12 flex flex-col m-auto">
          <PortableText value={exercise.content || []} />
        </div>
      );
    } else if (exercise.type === "soundslice") {
      setExerciseContent(
        <iframe
          src={exercise.soundsliceUrl}
          width="100%"
          height="400"
          allowFullScreen
        ></iframe>
      );
    } else if (exercise.type === "video") {
      setExerciseContent(
        <iframe
          src={exercise.videoUrl?.replace(
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
    } else {
      setExerciseContent(<p>No exercises available for this lesson.</p>);
    }
  };

  const returnCompletedExercises = (progressData) =>
    progressData
      .filter((progress) => progress.status === "complete")
      .map((progress) => progress.exercise_id);

  const returnDifficultExercises = (progressData) =>
    progressData
      .filter((progress) => progress.status === "too difficult")
      .map((progress) => progress.exercise_id);

  const handleMarkComplete = async (exerciseId) => {
    setIsMarkCompleteLoading(true);

    const response = await handleProgressUpdate(exerciseId, "complete");
    if (response.success) {
      alert("Exercise marked as complete!");
      setCompletedExerciseIds((prev) => [...prev, exerciseId]);
      setDifficultExerciseIds((prev) => prev.filter((id) => id !== exerciseId));
    } else {
      alert("Failed to mark exercise as complete.");
    }
    setIsMarkCompleteLoading(false);
  };

  const handleMarkTooDifficult = async (exerciseId) => {
    setIsTooDifficultLoading(true);

    const response = await handleProgressUpdate(exerciseId, "too difficult");
    if (response.success) {
      alert("Exercise marked as too difficult!");
      setDifficultExerciseIds((prev) => [...prev, exerciseId]);
      setCompletedExerciseIds((prev) => prev.filter((id) => id !== exerciseId));
    } else {
      alert("Failed to mark exercise as too difficult.");
    }
    setIsTooDifficultLoading(false);
  };

  return (
    <LessonContext.Provider
      value={{
        lesson,
        userNotes,
        exerciseContent,
        setUserNotes,
        setExerciseContent,
        handleMarkComplete,
        handleMarkTooDifficult,
        isMarkCompleteLoading,
        isTooDifficultLoading,
        completedExerciseIds,
        difficultExerciseIds,
        setExerciseId,
        setSelectedExerciseTitle,
        selectedExerciseTitle,
        exerciseId,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

export const useLessonContext = () => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error("useLessonContext must be used within a LessonProvider");
  }
  return context;
};
