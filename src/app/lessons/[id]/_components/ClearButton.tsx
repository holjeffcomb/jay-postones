import { useLessonContext } from "../lessonContext";
import { handleClearProgress } from "@/app/utils/supabaseService";

export default function ClearButton() {
  const {
    exerciseId,
    lesson,
    setCompletedExerciseIds,
    setDifficultExerciseIds,
  } = useLessonContext();

  if (!lesson || !exerciseId) {
    return null;
  }

  const handleClear = async () => {
    const result = await handleClearProgress(exerciseId);

    if (!result) {
      console.error("Failt to clear progress");
    } else {
      console.log("Progress cleared");
      setCompletedExerciseIds((prev) => prev.filter((id) => id !== exerciseId));
      setDifficultExerciseIds((prev) => prev.filter((id) => id !== exerciseId));
    }
  };

  return (
    <button
      className="text-gray-600 hover:text-gray-800 px-4 font-bold transition-colors duration-200 ease-in-out"
      onClick={() => handleClear()}
    >
      <p className="font-normal text-bold">Clear</p>
    </button>
  );
}
