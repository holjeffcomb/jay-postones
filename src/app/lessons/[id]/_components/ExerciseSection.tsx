import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import { useLessonContext } from "../lessonContext";
import MarkButton from "./MarkButton";
import ClearButton from "./ClearButton";

const LoadingWheel = "/images/animations/loadingwheel.svg";
const LoadingDots = "/images/animations/loadingdots.svg";

export default function ExerciseSection() {
  const {
    selectedExerciseTitle,
    lesson,
    exerciseContent,
    exerciseId,
    completedExerciseIds,
    difficultExerciseIds,
    lessonExercises = [], // Ensure default to an empty array
    isPageLoading,
    loadExerciseContent,
  } = useLessonContext();

  const currentExerciseIndex = lessonExercises.findIndex(
    (exercise) => exercise.id === exerciseId
  );

  const hasPrevExercise = currentExerciseIndex > 0;
  const hasNextExercise = currentExerciseIndex < lessonExercises.length - 1;

  const goToPrevExercise = () => {
    if (hasPrevExercise) {
      const prevExercise = lessonExercises[currentExerciseIndex - 1];
      loadExerciseContent(prevExercise);
    }
  };

  const goToNextExercise = () => {
    if (hasNextExercise) {
      const nextExercise = lessonExercises[currentExerciseIndex + 1];
      loadExerciseContent(nextExercise);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center lg:w-3/4 w-full bg-[var(--accent-color)]">
      {isPageLoading ? (
        <div className="animate-fadeIn">
          <Image src={LoadingDots} alt="Loading..." height={100} width={180} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 justify-between p-5 h-full w-full">
          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="font-extrabold text-2xl text-[var(--secondary-color)]">
              {selectedExerciseTitle}
            </h1>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
            >
              back
            </button>
          </div>

          <div className="h-full w-full">{exerciseContent}</div>

          <div className="flex gap-2 text-xs items-center justify-between w-full">
            {/* Previous Exercise Button */}
            <div className="flex justify-center items-center w-24 ml-18">
              {hasPrevExercise ? (
                <button
                  onClick={goToPrevExercise}
                  className="flex flex-col items-center text-gray-600 hover:text-[var(--primary-color)] font-medium transition-colors"
                >
                  <FaArrowLeft className="text-lg mb-1" />
                  <p>Prev Exercise</p>
                </button>
              ) : (
                <div className="flex flex-col items-center invisible">
                  <FaArrowLeft className="text-lg mb-1" />
                  <p>Prev Exercise</p>
                </div>
              )}
            </div>

            {/* Download Button */}
            {/* <div className="flex justify-center items-center w-24">
            {lesson.downloadableFile?.asset._ref ? (
              <a
                href={getUrlFromId(lesson.downloadableFile.asset._ref)}
                download
              >
                <button className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded">
                  Download
                </button>
              </a>
            ) : (
              <div className="invisible">Download</div>
            )}
          </div> */}

            {/* Mark Buttons and Clear Button */}
            <div className="flex justify-center items-center gap-2 w-124">
              {exerciseId ? (
                <>
                  <MarkButton kind="difficult" />
                  <MarkButton kind="complete" />
                  {difficultExerciseIds.includes(exerciseId) ||
                  completedExerciseIds.includes(exerciseId) ? (
                    <ClearButton />
                  ) : (
                    <div className="w-24"></div>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>

            {/* Next Exercise Button */}
            <div className="flex justify-center items-center w-24">
              {hasNextExercise ? (
                <button
                  onClick={goToNextExercise}
                  className="flex flex-col items-center text-gray-600 hover:text-[var(--primary-color)] font-medium transition-colors mr-18"
                >
                  <FaArrowRight className="text-lg mb-1" />
                  <p>Next Exercise</p>
                </button>
              ) : (
                <div className="flex flex-col items-center invisible">
                  <FaArrowRight className="text-lg mb-1" />
                  <p>Next Exercise</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
