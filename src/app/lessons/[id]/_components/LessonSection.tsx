import React from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
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
import {
  handleAddToPracticeList,
  handleRemoveFromPracticeList,
} from "@/app/utils/supabaseService";
import { useState } from "react";

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
  marks: {
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-bold">{children}</strong>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-5 text-[var(--secondary-color)]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-5 text-[var(--secondary-color)]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="my-2">{children}</li>,
    number: ({ children }) => <li className="my-2">{children}</li>,
  },
  hardBreak: () => <br />,
  unknownMark: () => null,
  unknownType: () => null,
  unknownBlockStyle: () => null,
  unknownList: () => null,
  unknownListItem: () => null,
};

const LoadingWheel = "/images/animations/loadingwheel.svg";

export default function LessonSection() {
  const { lesson, isInPracticeList, setIsInPracticeList } = useLessonContext();
  const [isPracticeListUpdating, setIsPracticeListUpdating] =
    useState<boolean>(false);

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center lg:w-1/4 w-full p-4 bg-[#D9D9D9] text-[var(--primary-color)]"></div>
    );
  }

  // Handler function for button click
  const handleButtonClick = async () => {
    if (isInPracticeList) {
      setIsPracticeListUpdating(true);
      await handleRemoveFromPracticeList(lesson._id);
      setIsInPracticeList(false); // Remove lesson from practice list
      setIsPracticeListUpdating(false);
    } else {
      setIsPracticeListUpdating(true);
      await handleAddToPracticeList(lesson._id);
      setIsInPracticeList(true); // Add lesson to practice list
      setIsPracticeListUpdating(false);
    }
  };
  return (
    <div className="flex flex-col items-start lg:w-1/4 w-full p-4 bg-[#D9D9D9] text-[var(--primary-color)]">
      <div className="text-left mb-2">
        <h1 className="font-bold text-2xl">{lesson.title}</h1>
        <button
          className={`text-xs border border-[var(--primary-color)] py-1 px-2 rounded-xl flex items-center gap-2 my-2 ${
            isInPracticeList
              ? "bg-[var(--secondary-color)] text-[var(--text-color)] hover:bg-[var(--primary-color)]"
              : "bg-[var(--accent-color)] text-[var(--primary-color)]"
          }`}
          onClick={handleButtonClick}
        >
          {isInPracticeList ? (
            <>
              {isPracticeListUpdating ? (
                <Image
                  src={LoadingWheel}
                  width={16}
                  height={16}
                  alt="Loading..."
                />
              ) : (
                <AiOutlineMinus className="w-3 h-3" />
              )}
              Remove from Practice List
            </>
          ) : (
            <>
              {isPracticeListUpdating ? (
                <Image
                  src={LoadingWheel}
                  width={16}
                  height={16}
                  alt="Loading..."
                />
              ) : (
                <AiOutlinePlus className="w-3 h-3" />
              )}
              Add to Practice List
            </>
          )}
        </button>
        {lesson.downloadableFiles ? (
          <button className="rounded-md px-4 py-1 transition duration-300 ease-in-out hover:shadow-lg">
            <div className="flex gap-2 justify-left items-center">
              <Image
                src="/images/icons/file-download.svg"
                width={30}
                height={30}
                alt="Lesson Resources"
              />
              <p className="text-xs font-semibold">Lesson Resources</p>
            </div>
          </button>
        ) : (
          <></>
        )}

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
