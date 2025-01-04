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

  // Determine if the button is marked
  const isMarked =
    kind === "difficult"
      ? difficultExerciseIds.includes(exerciseId || "")
      : completedExerciseIds.includes(exerciseId || "");

  const buttonBackground = isMarked
    ? "bg-[var(--secondary-color)]"
    : "bg-[#D9D9D9]";

  const buttonTextColor = isMarked
    ? "text-[var(--highlight-color)]"
    : "text-[var(--primary-color)]";

  // Ensure hover text color stays light when marked
  const hoverButtonTextColor = isMarked
    ? "hover:text-[var(--highlight-color)]"
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
      {isMarked ? (
        <>
          {kind === "difficult" ? (
            <LiaGrinBeamSweat className="w-4 h-4" />
          ) : (
            <FaCheck className="w-3 h-3" />
          )}
          <p>
            {kind === "difficult"
              ? "Marked as Too Difficult"
              : "Marked Complete"}
          </p>
        </>
      ) : isMarkedLoading(kind) ? (
        <Image src={LoadingWheel} width={18} height={18} alt="loading" />
      ) : (
        <>
          <p>
            {kind === "difficult" ? "Mark as Too Difficult" : "Mark Complete"}
          </p>
        </>
      )}
    </button>
  );

  function isMarkedLoading(kind: string): boolean {
    return kind === "difficult" ? isTooDifficultLoading : isMarkCompleteLoading;
  }
}
