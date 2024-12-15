"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "../../../lib/sanityClient";
import { FaFont, FaVideo, FaMusic } from "react-icons/fa";
import {
  PortableText,
  PortableTextBlock,
  PortableTextReactComponents,
  PortableTextComponentProps,
} from "@portabletext/react";
import { urlFor, getUrlFromId } from "../../../lib/sanityClient";
import { markLessonComplete } from "@/app/utils/lessonService";

// Type for exercise types
type ExerciseType = "portableText" | "video" | "soundslice";

// Type for each exercise
type Exercise = {
  type: ExerciseType;
  title: string;
  videoUrl?: string;
  soundsliceUrl?: string;
  content?: PortableTextBlock[]; // PortableText content type
};

// Type for lesson data
type Lesson = {
  _id: string;
  title: string;
  description: string;
  sticking?: string;
  tempo?: string;
  timeSignature?: string;
  videoUrl?: string;
  downloadableFile?: { asset: { _ref: string } };
  exercises: Exercise[];
};

const typeToIcon: Record<ExerciseType, JSX.Element> = {
  portableText: <FaFont />,
  video: <FaVideo />,
  soundslice: <FaMusic />,
};

export default function LessonPage() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [userNotes, setUserNotes] = useState<string>(
    "enter your own notes here..."
  );
  const [exerciseContent, setExerciseContent] = useState<JSX.Element | null>(
    null
  );
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const fetchLesson = async () => {
      const fetchedLesson = await client.fetch<Lesson>(
        `*[_type == "lesson" && _id == "${params.id}"][0]`
      );
      setLesson(fetchedLesson);

      // Update exerciseContent based on videoUrl
      if (fetchedLesson?.videoUrl?.startsWith("https://vimeo.com")) {
        setExerciseContent(
          <iframe
            src={fetchedLesson.videoUrl.replace(
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
      } else if (fetchedLesson?.videoUrl) {
        setExerciseContent(<p>Unsupported video format.</p>);
      } else {
        setExerciseContent(<p>No content available for this exercise.</p>);
      }
    };
    fetchLesson();
  }, [params.id]);

  const components: PortableTextReactComponents = {
    types: {
      image: ({
        value,
      }: {
        value: { asset: { _ref: string }; alt?: string };
      }) =>
        value?.asset ? (
          <img
            src={urlFor(value.asset).width(800).url()}
            alt={value.alt || "Image"}
            className="my-4 h-auto"
          />
        ) : null,
    },
    block: {
      h1: ({
        children,
        ...props
      }: PortableTextComponentProps<PortableTextBlock>) => (
        <h1
          className="text-2xl font-bold text-[var(--secondary-color)]"
          {...props}
        >
          {children}
        </h1>
      ),
      normal: ({
        children,
        ...props
      }: PortableTextComponentProps<PortableTextBlock>) => (
        <p className="text-[var(--secondary-color)]" {...props}>
          {children}
        </p>
      ),
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

  return (
    <div className="flex flex-row items-center justify-center h-auto">
      {lesson ? (
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
                {lesson.downloadableFile?.asset._ref && (
                  <a
                    href={getUrlFromId(lesson.downloadableFile.asset._ref)}
                    download
                  >
                    <button className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded">
                      Download
                    </button>
                  </a>
                )}
                <button
                  onClick={() => markLessonComplete(params.id)}
                  className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-start lg:w-1/3 w-full p-4 bg-[var(--highlight-color)] text-[var(--primary-color)]">
            <div className="text-left mb-2">
              <h2 className="font-bold mb-2">NOTES FROM JAY</h2>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.2" }}>
                {lesson.description}
              </div>
            </div>
            <div className="flex flex-col items-stretch justify-start w-full gap-2 my-2">
              {lesson.exercises.map((exercise, index) => (
                <button
                  key={index}
                  className="p-2 border rounded-md bg-white text-[var(--primary-color)] shadow-md flex items-start gap-2 hover:bg-gray-100 transition w-full"
                  onClick={() => {
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
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
