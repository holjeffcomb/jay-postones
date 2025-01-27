import { Exercise, Lesson, ExerciseType } from "../../../../../types/types";
import { PortableText } from "@portabletext/react";
import { components } from "./LessonSection";
import { FaFont, FaVideo, FaMusic, FaCheck } from "react-icons/fa";
import { LiaGrinBeamSweat } from "react-icons/lia";
import { useLessonContext } from "../lessonContext";

type ExerciseThumbnailProps = {
  exercise: Exercise;
};

export const typeToIcon: Record<ExerciseType, JSX.Element> = {
  portableText: <FaFont />,
  video: <FaVideo />,
  soundslice: <FaMusic />,
};

export default function ExerciseThumbnail({
  exercise,
}: ExerciseThumbnailProps) {
  const {
    exerciseId,
    setExerciseId,
    setSelectedExerciseTitle,
    setExerciseContent,
    lesson,
    completedExerciseIds,
    difficultExerciseIds,
    loadExerciseContent,
    userId,
  } = useLessonContext();

  if (!lesson) return null;

  // Dynamically determine button classes
  const isCompleted = completedExerciseIds.includes(exercise.id);
  const isDifficult = difficultExerciseIds.includes(exercise.id);

  const buttonClasses = `
    p-2 rounded-md shadow-md flex items-center justify-between transition w-full
    ${
      exercise.id === exerciseId
        ? "bg-[var(--secondary-color)] text-white"
        : isCompleted || isDifficult
        ? "bg-gray-500 text-[var(--text-color)] border-[var(--secondary-color)] hover:bg-gray-400 hover:text-[var(--secondary-color)]" // Dark background, light text, matching border
        : "bg-white text-[var(--primary-color)] border-gray-400 hover:bg-gray-600 hover:text-[var(--text-color)]"
      // Default background, dark text, light gray border
    }
    
  `;

  return (
    <>
      {userId && (
        <button
          className={buttonClasses}
          onClick={() => {
            loadExerciseContent(exercise, userId);
          }}
        >
          <div className="flex items-start gap-2">
            {typeToIcon[exercise.type] || <span>?</span>}
            <div>
              <h3 className="font-normal">{exercise.title}</h3>
            </div>
          </div>
          {isCompleted ? (
            <FaCheck className="w-3 h-3 text-white" />
          ) : isDifficult ? (
            <LiaGrinBeamSweat className="w-5 h-5 text-white" />
          ) : null}
        </button>
      )}
    </>
  );
}
