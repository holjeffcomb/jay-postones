import { Exercise, Lesson, ExerciseType } from "../../../../../types/types";
import { PortableText } from "@portabletext/react";
import { components } from "./LessonSection";
import { FaFont, FaVideo, FaMusic, FaCheck } from "react-icons/fa";
import { LiaGrinBeamSweat } from "react-icons/lia";

type ExerciseThumbnailProps = {
  setExerciseId: (id: string) => void;
  setSelectedExerciseTitle: (title: string) => void;
  exercise: Exercise;
  setExerciseContent: (content: JSX.Element) => void;
  lesson: Lesson;
  completedExerciseIds: string[];
  difficultExerciseIds: string[];
};

export const typeToIcon: Record<ExerciseType, JSX.Element> = {
  portableText: <FaFont />,
  video: <FaVideo />,
  soundslice: <FaMusic />,
};

export default function ExerciseThumbnail({
  setExerciseId,
  exercise,
  setSelectedExerciseTitle,
  setExerciseContent,
  lesson,
  completedExerciseIds,
  difficultExerciseIds,
}: ExerciseThumbnailProps) {
  return (
    <button
      className="p-2 border rounded-md bg-white text-[var(--primary-color)] shadow-md flex items-center justify-between hover:bg-gray-100 transition w-full"
      onClick={() => {
        setExerciseId(exercise.id);
        setSelectedExerciseTitle(exercise.title);

        if (exercise.type === "portableText") {
          setExerciseContent(
            <div className="w-10/12 flex flex-col m-auto">
              <PortableText
                value={exercise.content || []}
                components={components}
              />
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
              src={lesson.videoUrl?.replace(
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
      }}
    >
      <div className="flex items-start gap-2">
        {typeToIcon[exercise.type] || <span>?</span>}
        <div>
          <h3 className="font-normal">{exercise.title}</h3>
        </div>
      </div>
      {completedExerciseIds.includes(exercise.id) ? (
        <FaCheck className="w-3 h-3 text-[var(--primary-color)]" />
      ) : difficultExerciseIds.includes(exercise.id) ? (
        <LiaGrinBeamSweat className="w-5 h-5 text-[var(--primary-color)]" />
      ) : null}
    </button>
  );
}
