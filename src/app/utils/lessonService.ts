// src/utils/lessonService.ts
import { createClient } from "./supabase/client"; // Adjust the path as necessary
import { redirect } from "next/navigation";

const supabase = createClient();

export const handleProgressUpdate = async (
  exerciseId: string,
  status: "complete" | "in progress" | "too difficult" | "not interested"
) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect("/login");
    }

    const userId = user.id;

    const { error } = await supabase.from("progress").upsert([
      {
        id: `${userId}--${exerciseId}`,
        user_id: userId,
        exercise_id: exerciseId,
        status: status,
      },
    ]);

    if (error) {
      console.error("Error updating progress tracker:", error);
      alert("Failed to update progress tracker");
    } else {
      alert("Exercise added to progress tracker");
      if (status !== "in progress") {
        console.log("Progress updated successfully!");
      }
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("An unexpected error occurred");
  }
};

export const handleAddToPracticeList = async (lessonId: string) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect("/login");
    }

    const userId = user.id;

    const { error } = await supabase.from("practice_list").upsert([
      {
        id: `${userId}--${lessonId}`,
        user_id: userId,
        lesson_id: lessonId,
      },
    ]);
    if (error) {
      console.error("Error updating practice list tracker:", error);
      alert("Failed to update practice list");
    } else {
      console.log("Progress updated successfully!");
      alert("Lesson added to practice list");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("An unexpected error occurred");
  }
};
