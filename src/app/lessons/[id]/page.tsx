"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "../../../lib/sanityClient";

export default function LessonPage() {
  const [lesson, setLesson] = useState<any>(null);
  const [userNotes, setUserNotes] = useState<string>(
    "enter your own notes here..."
  );
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
  return (
    <div className="flex flex-row items-center justify-center h-screen bg-gray-200">
      {lesson ? (
        <>
          <div className="flex flex-row justify-between items-center w-full bg-gray-300 h-full">
            {/* <div className="flex flex-col items-center justify-start w-1/6 bg-[var(--secondary-color)] h-full">
              DASH
            </div> */}
            <div className="flex flex-col items-center justify-center w-2/3 bg-[var(--accent-color)] h-full">
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
                <iframe
                  src={lesson.soundslice}
                  width="100%"
                  height="500"
                  // frameborder="0"
                  // allowfullscreen
                  allow="autoplay"
                ></iframe>

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
                  {lesson.exercises.map((exercise: any, index: string) => (
                    <div key={index} className="m-2">
                      <img src={exercise.thumbnail} alt={exercise.title} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between w-1/3 bg-[var(--highlight-color)] h-full text-[var(--primary-color)]">
              {/* Top-aligned content */}
              <div>
                <div className="text-left px-4 py-2">
                  <h2 className="font-bold">NOTES FROM JAY</h2>
                  <p>{lesson.description}</p>
                </div>
                {lesson.sticking && (
                  <div className="text-left px-4 py-1 flex items-center text-sm">
                    <h2 className="font-bold">Sticking:</h2>
                    <p className="ml-2">{lesson.sticking}</p>
                  </div>
                )}
                {lesson.tempo && (
                  <div className="text-left px-4 py-1 flex items-center text-sm">
                    <h2 className="font-bold">Tempo:</h2>
                    <p className="ml-2">{lesson.tempo}</p>
                  </div>
                )}
                {lesson.timeSignature && (
                  <div className="text-left px-4 py-1 flex items-center text-sm">
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
