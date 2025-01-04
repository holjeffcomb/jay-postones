import { useLessonContext } from "../lessonContext";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import { LiaGrinBeamSweat } from "react-icons/lia";

const LoadingWheel = "/images/animations/loadingwheel.svg";

interface MarkButtonProps {
  kind: "difficult" | "complete";
}

export default function MarkButton({ kind }: MarkButtonProps) {
  const {
    isMarkCompleteLoading,
    isTooDifficultLoading,
    handleMarkComplete,
    handleMarkTooDifficult,
    exerciseId,
    completedExerciseIds,
    difficultExerciseIds,
  } = useLessonContext();

  const buttonBackground =
    kind === "difficult"
      ? difficultExerciseIds.includes(exerciseId || "") // Check if the exercise is in the difficult list
        ? "bg-[var(--secondary-color)]"
        : "bg-[#D9D9D9]"
      : completedExerciseIds.includes(exerciseId || "") // Check if the exercise is in the completed list
      ? "bg-[var(--secondary-color)]"
      : "bg-[#D9D9D9]";

  const buttonTextColor =
    kind === "difficult"
      ? difficultExerciseIds.includes(exerciseId || "") // Check if the exercise is in the difficult list
        ? "text-[var(--highlight-color)]"
        : "text-[var(--primary-color)]"
      : completedExerciseIds.includes(exerciseId || "") // Check if the exercise is in the completed list
      ? "text-[var(--highlight-color)]"
      : "text-[var(--primary-color)]";

  const hoverButtonTextColor =
    kind === "difficult"
      ? difficultExerciseIds.includes(exerciseId || "") // Check if the exercise is in the difficult list
        ? "hover:text-[var(--primary-color)]"
        : "hover:text-[var(--text-color)]"
      : completedExerciseIds.includes(exerciseId || "") // Check if the exercise is in the completed list
      ? "hover:text-[var(--primary-color)]"
      : "hover:text-[var(--text-color)]";

  return (
    <button
      onClick={() => {
        kind === "difficult"
          ? exerciseId && handleMarkTooDifficult(exerciseId)
          : exerciseId && handleMarkComplete(exerciseId);
      }}
      className={`w-48 h-8 ${buttonBackground} hover:bg-[var(--primary-color)] border border-[var(--primary-color)] ${buttonTextColor} ${hoverButtonTextColor} font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-all duration-200 ease-in-out`}
    >
      {kind === "difficult" ? (
        isTooDifficultLoading ? (
          <Image src={LoadingWheel} width={18} height={18} alt="loading" />
        ) : exerciseId && difficultExerciseIds.includes(exerciseId) ? (
          <>
            <LiaGrinBeamSweat className="w-4 h-4 text-white" />
            <p>Marked as Too Difficult</p>
          </>
        ) : (
          <>
            <p>Mark as Too Difficult</p>
          </>
        )
      ) : isMarkCompleteLoading ? (
        <Image src={LoadingWheel} width={18} height={18} alt="loading" />
      ) : exerciseId && completedExerciseIds.includes(exerciseId) ? (
        <>
          <FaCheck className="w-3 h-3 text-white" />
          <p>Marked Complete</p>
        </>
      ) : (
        <>
          <p>Mark Complete</p>
        </>
      )}
    </button>
  );
}
