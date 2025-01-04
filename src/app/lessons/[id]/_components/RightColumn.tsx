import React from "react";
import { Lesson, ExerciseType } from "../../../../../types/types";
import { FaFont, FaVideo, FaMusic, FaCheck } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { LiaGrinBeamSweat } from "react-icons/lia";
import {
  PortableTextReactComponents,
  PortableTextComponentProps,
  PortableTextBlock,
  PortableText,
} from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "../../../../lib/sanityClient";

type RightColumnProps = {
  lesson: Lesson;
  handleAddToPracticeList: (lessonId: string) => void;
  setExerciseId: (id: string) => void;
  setSelectedExerciseTitle: (title: string) => void;
  setExerciseContent: (content: JSX.Element) => void;
  completedExerciseIds: string[];
  difficultExerciseIds: string[];
  userNotes: string;
};

export const typeToIcon: Record<ExerciseType, JSX.Element> = {
  portableText: <FaFont />,
  video: <FaVideo />,
  soundslice: <FaMusic />,
};

export const components: PortableTextReactComponents = {
  types: {
    image: ({ value }: { value: { asset: { _ref: string }; alt?: string } }) =>
      value?.asset ? (
        <Image
          src={urlFor(value.asset).width(800).url()}
          alt={value.alt || "Image"}
          width={800}
          height={600}
          className="my-4 h-auto"
        />
      ) : null,
  },
  block: {
    h1: ({
      children,
      ...props
    }: PortableTextComponentProps<PortableTextBlock>) => {
      // Only pick necessary props to avoid passing invalid ones
      const { id, className } = props as { id?: string; className?: string };

      return (
        <h1
          id={id}
          className={`text-2xl font-bold text-[var(--secondary-color)] ${
            className || ""
          }`}
        >
          {children}
        </h1>
      );
    },
    normal: ({
      children,
      ...props
    }: PortableTextComponentProps<PortableTextBlock>) => {
      const { id, className } = props as { id?: string; className?: string };

      return (
        <p
          id={id}
          className={`text-[var(--secondary-color)] ${className || ""}`}
        >
          {children}
        </p>
      );
    },
  },
  marks: {},
  list: {},
  listItem: {},
  hardBreak: () => <br />,
  unknownMark: () => null,
  unknownType: () => null,
  unknownBlockStyle: () => null,
  unknownList: () => null,
  unknownListItem: () => null,
};

export default function RightColumn({
  lesson,
  handleAddToPracticeList,
  setExerciseId,
  setSelectedExerciseTitle,
  setExerciseContent,
  completedExerciseIds,
  difficultExerciseIds,
  userNotes,
}: RightColumnProps) {
  return (
    <div className="flex flex-col items-start lg:w-1/3 w-full p-4 bg-[var(--highlight-color)] text-[var(--primary-color)]">
      <div className="text-left mb-2">
        <h1 className="font-bold text-2xl">{lesson.title}</h1>
        <button
          className="text-xs border border-[var(--primary-color)] bg-[var(--accent-color)] hover:bg-[var(--secondary-color)] text-[var(--primary-color)] hover:text-[var(--text-color)] py-1 px-2 rounded-xl flex items-center gap-2 my-2"
          onClick={() => handleAddToPracticeList(lesson._id)}
        >
          <AiOutlinePlus className="w-3 h-3" />
          Add Lesson to Practice List
        </button>

        <h2 className="font-bold mb-2">NOTES FROM JAY</h2>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.2" }}>
          {lesson?.description}
        </div>
      </div>
      <div className="flex flex-col items-stretch justify-start w-full gap-2 my-2">
        {lesson?.exercises.map((exercise, index) => (
          <button
            key={index}
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
        ))}
      </div>
      {/* User Notes Section */}
      <div className="text-left w-full mt-auto">
        <h2 className="font-bold">USER NOTES</h2>
        <textarea
          className="w-full p-2 border rounded-md text-gray-400 resize-y min-h-60 max-h-40"
          placeholder={userNotes}
          defaultValue={userNotes}
          onFocus={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.value = target.value === userNotes ? "" : target.value;
          }}
          onChange={(e) => {
            const target = e.target as HTMLTextAreaElement;
            if (target.value !== userNotes) {
              target.classList.remove("text-gray-400");
              target.classList.add("text-black");
            } else {
              target.classList.remove("text-black");
              target.classList.add("text-gray-400");
            }
          }}
        />
      </div>
    </div>
  );
}
