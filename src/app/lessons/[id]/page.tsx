"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "../../../lib/sanityClient";

export default function LessonPage() {
  const [lesson, setLesson] = useState<any>(null);
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
            <div className="flex flex-col items-center justify-start w-1/6 bg-[var(--secondary-color)] h-full">
              DASH
            </div>
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
              </div>
            </div>
            <div className="flex flex-col items-center justify-between w-1/3 bg-[var(--highlight-color)] h-full text-[var(--primary-color)]">
              <div className="text-left p-4">
                <h2 className="font-bold">NOTES FROM JAY</h2>
                <p>{lesson.description}</p>
              </div>
              <div className="text-left p-4 w-full relative">
                <h2 className="font-bold">USER NOTES</h2>
                <textarea
                  className="w-full p-2 border rounded-md text-gray-400 h-72"
                  placeholder="enter your own notes here..."
                  defaultValue="enter your own notes here..."
                  onFocus={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.value =
                      target.value === "enter your own notes here..."
                        ? ""
                        : target.value;
                  }}
                  onChange={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    if (target.value !== "enter your own notes here...") {
                      target.classList.remove("text-gray-400");
                      target.classList.add("text-black");
                    } else {
                      target.classList.remove("text-black");
                      target.classList.add("text-gray-400");
                    }
                  }}
                />
                <button className="absolute bottom-8 right-8 bg-[var(--secondary-color)] text-white px-4 py-1 rounded">
                  <p className="font-bold">SAVE</p>
                </button>
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
