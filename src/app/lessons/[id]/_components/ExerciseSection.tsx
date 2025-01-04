import React from "react";

import Image from "next/image";
import { getUrlFromId } from "../../../../lib/sanityClient";
import { LiaGrinBeamSweat } from "react-icons/lia";
import { FaCheck } from "react-icons/fa";
import { useLessonContext } from "../lessonContext";
import { Lesson } from "../../../../../types/types";

const LoadingWheel = "/images/animations/loadingwheel.svg";
const LoadingDots = "/images/animations/loadingdots.svg";

export default function ExerciseSection() {
  const {
    selectedExerciseTitle,
    lesson,
    exerciseContent,
    exerciseId,
    handleMarkTooDifficult,
    handleMarkComplete,
    isMarkCompleteLoading,
    isTooDifficultLoading,
  } = useLessonContext();

  if (!lesson) {
    return <Image src={LoadingDots} width={250} height={120} alt="loading" />;
  }
  return (
    <div className="flex flex-col items-center justify-start lg:w-2/3 w-full bg-[var(--accent-color)]">
      <div className="flex flex-col items-center gap-6 justify-between p-5 w-full">
        <div className="flex flex-row items-center justify-between w-full">
          <h1 className="font-extrabold text-2xl text-[var(--secondary-color)]">
            {selectedExerciseTitle || lesson.title}
          </h1>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
          >
            back
          </button>
        </div>
        <div className="h-full w-full">{exerciseContent}</div>
        <div className="flex gap-2 text-xs">
          {lesson.downloadableFile?.asset._ref && (
            <a href={getUrlFromId(lesson.downloadableFile.asset._ref)} download>
              <button className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded">
                Download
              </button>
            </a>
          )}
          {exerciseId ? (
            <>
              <button
                onClick={() => handleMarkTooDifficult(exerciseId)}
                className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              >
                {isTooDifficultLoading ? (
                  <Image
                    src={LoadingWheel}
                    width={18}
                    height={18}
                    alt="loading"
                  />
                ) : (
                  <LiaGrinBeamSweat className="w-5 h-5 text-white" />
                )}
                Mark as Too Difficult
              </button>
              <button
                onClick={() => handleMarkComplete(exerciseId)}
                className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              >
                {isMarkCompleteLoading ? (
                  <Image
                    src={LoadingWheel}
                    width={18}
                    height={18}
                    alt="loading"
                  />
                ) : (
                  <FaCheck className="w-3 h-3 text-white" />
                )}
                Mark as Complete
              </button>
            </>
          ) : (
            <Image src={LoadingDots} width={18} height={18} alt="loading" />
          )}
        </div>
      </div>
    </div>
  );
}
