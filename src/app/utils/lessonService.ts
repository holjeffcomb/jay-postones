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
