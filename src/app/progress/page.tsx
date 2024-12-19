"use client";

import { createClient } from "../utils/supabase/client";
import { useState, useEffect } from "react";

const supabase = createClient();

export default function ProgressPage() {
  const [lessonsWithExercises, setLessonsWithExercises] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId], // Toggle expanded state
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch exercises with lesson titles
        const { data: exercises, error: exercisesError } = await supabase
          .from("exercises")
          .select("id, title, lesson_id");

        if (exercisesError) {
          console.error("Error fetching exercises:", exercisesError);
          return;
        }

        // Fetch lessons to get lesson titles
        const { data: lessons, error: lessonsError } = await supabase
          .from("lessons")
          .select("id, title");

        if (lessonsError) {
          console.error("Error fetching lessons:", lessonsError);
          return;
        }

        // Group exercises by lesson_id
        const groupedData: any = {};
        exercises.forEach((exercise) => {
          const lessonTitle =
            lessons.find((lesson) => lesson.id === exercise.lesson_id)?.title ||
            "Unknown Lesson";
          if (!groupedData[exercise.lesson_id]) {
            groupedData[exercise.lesson_id] = {
              lessonTitle,
              exercises: [],
            };
          }
          groupedData[exercise.lesson_id].exercises.push(exercise);
        });

        setLessonsWithExercises(groupedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-4/5 m-auto">
      <h1 className="text-2xl font-bold mb-4">Progress Tracker</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2"></th>
            <th className="border border-gray-300 p-2">Not Started</th>
            <th className="border border-gray-300 p-2">Hard</th>
            <th className="border border-gray-300 p-2">In Progress</th>
            <th className="border border-gray-300 p-2">Complete</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(lessonsWithExercises).map((lessonId) => (
            <>
              {/* Lesson Row */}
              <tr key={`lesson-${lessonId}`}>
                <td
                  colSpan={5}
                  className="font-bold text-lg bg-[var(--secondary-color)] border border-gray-300 p-2 text-left flex items-center"
                >
                  <button
                    className="mr-2 focus:outline-none"
                    onClick={() => toggleLesson(lessonId)}
                  >
                    {expandedLessons[lessonId] ? (
                      <span>&#9660;</span> // Down arrow
                    ) : (
                      <span>&#9654;</span> // Right arrow
                    )}
                  </button>
                  {lessonsWithExercises[lessonId].lessonTitle}
                </td>
              </tr>
              {/* Exercise Rows */}
              {expandedLessons[lessonId] &&
                lessonsWithExercises[lessonId].exercises.map(
                  (exercise: any) => (
                    <tr key={exercise.id} className="text-center">
                      <td className="border border-gray-300 p-2 text-left pl-8">
                        {exercise.title}
                      </td>
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 p-2"></td>
                    </tr>
                  )
                )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
