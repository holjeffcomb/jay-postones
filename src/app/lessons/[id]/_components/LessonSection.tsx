import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
  PortableTextReactComponents,
  PortableTextComponentProps,
  PortableTextBlock,
} from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "../../../../lib/sanityClient";
import ExerciseThumbnail from "./ExerciseThumbnail";
import { useLessonContext } from "../lessonContext";
import { Exercise } from "../../../../../types/types";
import { handleAddToPracticeList } from "@/app/utils/supabaseService";

const LoadingDots = "/images/animations/loadingdots.svg";

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

export default function LessonSection() {
  const {
    lesson,
    setExerciseId,
    setSelectedExerciseTitle,
    setExerciseContent,
    completedExerciseIds,
    difficultExerciseIds,
    userNotes,
  } = useLessonContext();
  if (!lesson) {
    return <Image src={LoadingDots} width={250} height={120} alt="loading" />;
  }
  return (
    <div className="flex flex-col items-start lg:w-1/4 w-full p-4 bg-[#D9D9D9] text-[var(--primary-color)]">
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
        {lesson?.exercises.map((exercise: Exercise, index: number) => (
          <ExerciseThumbnail key={index} exercise={exercise} />
        ))}
      </div>
      {/* User Notes Section */}
      {/* <div className="text-left w-full mt-auto">
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
      </div> */}
    </div>
  );
}
