"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "../../../lib/sanityClient";
import { FaFont, FaVideo, FaMusic } from "react-icons/fa";
import { PortableText } from "@portabletext/react";
import { urlFor, getUrlFromId } from "../../../lib/sanityClient";

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

      // Update exerciseContent based on videoUrl
      if (lesson?.videoUrl?.startsWith("https://vimeo.com")) {
        setExerciseContent(
          <iframe
            src={lesson.videoUrl.replace(
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
      } else if (lesson?.videoUrl) {
        setExerciseContent(<p>Unsupported video format.</p>);
      } else {
        setExerciseContent(<p>No content available for this exercise.</p>);
      }
    };
    fetchLesson();
  }, [params.id]);

  const components = {
    types: {
      image: ({ value }: { value: any }) => {
        if (!value?.asset) return null; // Skip rendering if URL is missing
        return (
          <img
            src={urlFor(value.asset).width(800).url()}
            alt={value.alt || "Image"}
            className="my-4 h-auto"
          />
        );
      },
    },
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-2xl font-bold text-[var(--secondary-color)]">
          {children}
        </h1>
      ),
      normal: ({ children }: any) => (
        <p className="text-[var(--secondary-color)]">{children}</p>
      ),
    },
  };

  return (
    <div className="flex flex-row items-center justify-center h-auto">
      {lesson ? (
        <>
          <div className="flex lg:flex-row flex-col justify-between w-full bg-gray-300 items-stretch">
            {/* Left Column */}
            <div className="flex flex-col items-center justify-start lg:w-2/3 w-full bg-[var(--accent-color)]">
              <div className="flex flex-col items-center gap-6 justify-between p-5 w-full">
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
                <div className="h-full w-full">{exerciseContent}</div>
                <div className="flex gap-2 text-xs">
                  <button className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded">
                    Add to Practice List
                  </button>
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
                    <></>
                  )}
                  <button className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded">
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col items-start lg:w-1/3 w-full p-4 bg-[var(--highlight-color)] text-[var(--primary-color)]">
              {/* Top section */}
              <div className="flex flex-col flex-grow items-stretch w-full">
                <div className="text-left mb-2">
                  <h2 className="font-bold mb-2">NOTES FROM JAY</h2>
                  <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.2" }}>
                    {lesson.description}
                  </div>
                </div>
                {lesson.sticking || lesson.tempo || lesson.timeSignature ? (
                  <div className="bg-[var(--accent-color)] my-2 rounded-md p-1 inline-block max-w-max">
                    {lesson.sticking && (
                      <div className="text-left px-1 flex items-start text-sm">
                        <h2 className="font-bold">Sticking:</h2>
                        <p className="ml-2">{lesson.sticking}</p>
                      </div>
                    )}
                    {lesson.tempo && (
                      <div className="text-left px-1 flex items-start text-sm">
                        <h2 className="font-bold">Tempo:</h2>
                        <p className="ml-2">{lesson.tempo}</p>
                      </div>
                    )}
                    {lesson.timeSignature && (
                      <div className="text-left px-1 flex items-start text-sm">
                        <h2 className="font-bold">Time Signature:</h2>
                        <p className="ml-2">{lesson.timeSignature}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                <div className="flex flex-col items-stretch justify-start w-full gap-2 my-2">
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
                        className="p-2 border rounded-md bg-white text-[var(--primary-color)] shadow-md flex items-start gap-2 hover:bg-gray-100 transition w-full"
                        onClick={() => {
                          if (exercise.type === "portableText") {
                            setExerciseContent(
                              <div className="w-10/12 flex flex-col m-auto">
                                <PortableText
                                  value={exercise.content}
                                  components={components}
                                />
                              </div>
                            );
                          }
                          if (exercise.type === "soundslice") {
                            setExerciseContent(
                              <iframe
                                src={exercise.soundsliceUrl}
                                width="100%"
                                height="400"
                                allowFullScreen
                              ></iframe>
                            );
                          }
                          if (exercise.type === "video") {
                            if (
                              lesson?.videoUrl?.startsWith("https://vimeo.com")
                            ) {
                              setExerciseContent(
                                <iframe
                                  src={lesson.videoUrl.replace(
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
                            } else if (lesson?.videoUrl) {
                              setExerciseContent(
                                <p>Unsupported video format.</p>
                              );
                            } else {
                              setExerciseContent(
                                <p>No content available for this exercise.</p>
                              );
                            }
                          }
                        }}
                      >
                        <div className="flex items-start gap-2">
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
              <div className="text-left w-full mt-auto">
                <h2 className="font-bold">USER NOTES</h2>
                <textarea
                  className="w-full p-2 border rounded-md text-gray-400 resize-y min-h-60 max-h-40"
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
