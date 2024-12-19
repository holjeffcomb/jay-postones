// src/utils/lessonService.ts
import { createClient } from "./supabase/client"; // Adjust the path as necessary
import { redirect } from "next/navigation";

const supabase = createClient();

export const markLessonComplete = async (lessonId: string) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect("/login");
    }

    const { error: functionError } = await supabase.rpc("append_to_complete", {
      lessonid: lessonId,
      userid: user.id,
    });

    if (functionError) {
      console.error("Error calling append_to_complete:", functionError);
      alert("Failed to mark lesson as complete");
    }

    alert("Lesson marked as complete");
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("An unexpected error occurred");
  }
};

export const markLessonInProgress = async (lessonId: string) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect("/login");
    }

    const { error: functionError } = await supabase.rpc(
      "append_to_in_progress",
      {
        lessonid: lessonId,
        userid: user.id,
      }
    );

    if (functionError) {
      console.error("Error calling append_to_in_progress:", functionError);
      alert("Failed to mark lesson as in progress");
    }

    alert("Lesson marked as in progress");
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("An unexpected error occurred");
  }
};

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
      console.log("Progress updated successfully!");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("An unexpected error occurred");
  }
};
