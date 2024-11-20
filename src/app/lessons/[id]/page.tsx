"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "../../../lib/sanityClient";
import { FaFont, FaVideo, FaMusic } from "react-icons/fa";
import { PortableText } from "@portabletext/react";
import { urlFor } from "../../../lib/sanityClient";

const typeToIcon = {
  portableText: <FaFont />,
  video: <FaVideo />,
  soundslice: <FaMusic />,
};

// Define a type for exercise types
type ExerciseType = "portableText" | "video" | "soundslice";

export default function LessonPage() {
  const [lesson, setLesson] = useState<any>(null);
  const [userNotes, setUserNotes] = useState<string>(
    "enter your own notes here..."
  );
  const [exerciseContent, setExerciseContent] = useState<any>(null);
  const params = useParams();

  useEffect(() => {
    const fetchLesson = async () => {
      const lesson = await client.fetch(
        `*[_type == "lesson" && _id == "${params.id}"][0]`
      );
      setLesson(lesson);
    };
    fetchLesson();
  }, []);

  const components = {
    types: {
      image: ({ value }: { value: any }) => {
        console.log("Image Value:", value); // Debugging
        if (!value?.asset) return null; // Skip rendering if URL is missing
        return (
          <img
            src={urlFor(value.asset).width(300).url()}
            alt={value.alt || "Image"}
            className="my-4 h-auto"
          />
        );
      },
    },
  };

  return (
    <div className="flex flex-row items-center justify-center min-h-screen ">
      {lesson ? (
        <>
          <div className="flex flex-row justify-between items-center w-full bg-gray-300">
            {/* <div className="flex flex-col items-center justify-start w-1/6 bg-[var(--secondary-color)] h-full">
              DASH
            </div> */}
            <div className="flex flex-col items-center justify-center w-2/3 bg-[var(--accent-color)] min-h-screen">
              <div className="flex flex-col items-center justify-between h-full p-5 w-full">
                <div className="flex flex-row items-center justify-between w-full">
                  <h1 className="font-extrabold text-2xl text-[var(--secondary-color)]">
                    {lesson.title}
                  </h1>
                  <button
                    onClick={() => window.history.back()}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
                  >
                    back
                  </button>
                </div>
                <div className="min-h-96">
                  {exerciseContent ? (
                    typeof exerciseContent === "string" ? (
                      <p>{exerciseContent}</p>
                    ) : (
                      <PortableText
                        value={exerciseContent}
                        components={components}
                      />
                    )
                  ) : (
                    <p>Select an exercise to view its content.</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded">
                    Add to Practice List
                  </button>
                  <button className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded">
                    Download GP File
                  </button>
                  <button className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded">
                    Mark Complete
                  </button>
                </div>
                <div className="flex flex-row items-center justify-center w-full">
                  {lesson.exercises.map(
                    (
                      exercise: {
                        type: ExerciseType;
                        title: string;
                        videoUrl?: string;
                        soundsliceUrl?: string;
                        content?: any;
                      },
                      index: number
                    ) => (
                      <button
                        key={index}
                        className="m-2 p-4 border rounded-md bg-white text-[var(--primary-color)] shadow-md flex items-start gap-4 hover:bg-gray-100 transition"
                        onClick={() =>
                          setExerciseContent(
                            exercise.content || "No content available"
                          )
                        }
                      >
                        <div className="flex items-center gap-2">
                          {typeToIcon[exercise.type] || <span>?</span>}
                          <div>
                            <h3 className="font-normal">{exercise.title}</h3>
                          </div>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between w-1/3 bg-[var(--highlight-color)] h-full text-[var(--primary-color)]">
              <div>
                <div className="text-left px-4 py-5">
                  <h2 className="font-bold">NOTES FROM JAY</h2>
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {lesson.description}
                  </div>
                </div>

                {lesson.sticking && (
                  <div className="text-left px-4 py-0 flex items-center text-sm">
                    <h2 className="font-bold">Sticking:</h2>
                    <p className="ml-2">{lesson.sticking}</p>
                  </div>
                )}
                {lesson.tempo && (
                  <div className="text-left px-4 py-0 flex items-center text-sm">
                    <h2 className="font-bold">Tempo:</h2>
                    <p className="ml-2">{lesson.tempo}</p>
                  </div>
                )}
                {lesson.timeSignature && (
                  <div className="text-left px-4 py-0 flex items-center text-sm">
                    <h2 className="font-bold">Time Signature:</h2>
                    <p className="ml-2">{lesson.timeSignature}</p>
                  </div>
                )}
              </div>

              {/* Bottom-aligned content */}
              <div className="text-left p-4 w-full">
                <h2 className="font-bold">USER NOTES</h2>
                <textarea
                  className="w-full p-2 border rounded-md text-gray-400 h-72"
                  placeholder={userNotes}
                  defaultValue={userNotes}
                  onFocus={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.value =
                      target.value === userNotes ? "" : target.value;
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
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
