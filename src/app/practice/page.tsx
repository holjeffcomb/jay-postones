"use client";

import { createClient } from "../utils/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const supabase = createClient();

export default function PracticePage() {
  const [practiceList, setPracticeList] = useState<{ lesson_id: string }[]>([]);
  const [practiceItems, setPracticeItems] = useState<
    {
      lessonId: string;
      title: string;
      description: string;
    }[]
  >([]);
  const [lessonsWithExercises, setLessonsWithExercises] = useState<any>({});
  const [progress, setProgress] = useState<{ [exerciseId: string]: string }>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState<{
    [key: string]: boolean;
  }>({});

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          console.error("User not logged in");
          router.push("/login");
          return;
        }

        const { data: practiceLessons, error: practiceLessonsError } =
          await supabase
            .from("practice_list")
            .select("lesson_id")
            .eq("user_id", user.id);

        if (practiceLessons) {
          // Extract only the lesson_id values from the practiceLessons array
          const lessonIds = practiceLessons.map((item) => item.lesson_id);

          if (lessonIds.length === 0) {
            console.error("No lessons found in practice list");
            return;
          }

          setPracticeList(practiceLessons);

          // Fetch the lessons with the extracted lessonIds
          const { data: lessons, error: lessonsError } = await supabase
            .from("lessons")
            .select("title, description, id")
            .in("id", lessonIds); // Use `.in()` instead of `.eq()`

          if (lessonsError) {
            console.error("Error fetching lessons:", lessonsError);
            return;
          }

          if (lessons) {
            console.log("Lessons fetched successfully:", lessons);
            setPracticeItems(
              lessons.map((lesson) => ({
                lessonId: lesson.id,
                title: lesson.title,
                description: lesson.description,
              }))
            );
          } else {
            console.error("No lessons returned");
          }
        } else {
          console.error(
            "Error fetching practice lessons:",
            practiceLessonsError
          );
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // const toggleLesson = (lessonId: string) => {
  //   setExpandedLessons((prev) => ({
  //     ...prev,
  //     [lessonId]: !prev[lessonId], // Toggle expanded state
  //   }));
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Fetch exercises with lesson titles
  //       const { data: exercises, error: exercisesError } = await supabase
  //         .from("exercises")
  //         .select("id, title, lesson_id");

  //       if (exercisesError) {
  //         console.error("Error fetching exercises:", exercisesError);
  //         return;
  //       }

  //       // Fetch lessons to get lesson titles
  //       const { data: lessons, error: lessonsError } = await supabase
  //         .from("lessons")
  //         .select("id, title");

  //       if (lessonsError) {
  //         console.error("Error fetching lessons:", lessonsError);
  //         return;
  //       }

  //       // Group exercises by lesson_id
  //       const groupedData: any = {};
  //       exercises.forEach((exercise) => {
  //         const lessonTitle =
  //           lessons.find((lesson) => lesson.id === exercise.lesson_id)?.title ||
  //           "Unknown Lesson";
  //         if (!groupedData[exercise.lesson_id]) {
  //           groupedData[exercise.lesson_id] = {
  //             lessonTitle,
  //             exercises: [],
  //           };
  //         }
  //         groupedData[exercise.lesson_id].exercises.push(exercise);
  //       });

  //       setLessonsWithExercises(groupedData);

  //       // Fetch progress data for the logged-in user
  //       const {
  //         data: { user },
  //       } = await supabase.auth.getUser();

  //       if (!user) {
  //         console.error("User not logged in.");
  //         return;
  //       }

  //       const { data: progressData, error: progressError } = await supabase
  //         .from("progress")
  //         .select("exercise_id, status")
  //         .eq("user_id", user.id);

  //       if (progressError) {
  //         console.error("Error fetching progress:", progressError);
  //         return;
  //       }

  //       // Map progress data by exercise_id
  //       const progressMap: { [exerciseId: string]: string } = {};
  //       progressData.forEach(
  //         (entry: { exercise_id: string; status: string }) => {
  //           progressMap[entry.exercise_id] = entry.status;
  //         }
  //       );

  //       setProgress(progressMap);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {practiceItems ? (
        practiceItems.map((item, index) => (
          <div className="flex flex-row">
            <Link href={`/lessons/${item.lessonId}`} key={index}>
              {item.title}
            </Link>
            <p>{item.description}</p>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
