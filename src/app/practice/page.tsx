"use client";

import { createClient } from "../utils/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const supabase = createClient();

export default function PracticePage() {
  const [practiceItems, setPracticeItems] = useState<
    {
      lessonId: string;
      title: string;
      description: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {practiceItems ? (
        practiceItems.map((item, index) => (
          <div key={index} className="flex flex-row">
            <Link href={`/lessons/${item.lessonId}`}>{item.title}</Link>
            <p>{item.description}</p>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
