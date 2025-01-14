// src/utils/lessonService.ts
import { createClient } from "./supabase/client"; // Adjust the path as necessary
import { redirect } from "next/navigation";

const supabase = createClient();

export const handleProgressUpdate = async (
  exerciseId: string,
  status: "complete" | "in progress" | "too difficult" | "not interested"
): Promise<{ success: boolean; error?: string }> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "User not authenticated. Redirecting to login.",
      };
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
      return {
        success: false,
        error: "Failed to update progress tracker. Please try again later.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

export const handleClearProgress = async (exerciseId: string) => {
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
        status: null,
      },
    ]);
    if (error) {
      return {
        success: false,
        error: "Failed to update progress tracker. Please try again later.",
      };
    }
    return {
      success: true,
    };
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

export const handleRemoveFromPracticeList = async (lessonId: string) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect("/login");
      return;
    }

    const userId = user.id;

    // Delete the entry from the practice_list table
    const { error } = await supabase
      .from("practice_list")
      .delete()
      .eq("id", `${userId}--${lessonId}`); // Match the composite key (userId--lessonId)

    if (error) {
      console.error("Error removing lesson from practice list:", error);
      alert("Failed to remove lesson from practice list");
    } else {
      console.log("Lesson removed from practice list successfully!");
      alert("Lesson removed from practice list");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("An unexpected error occurred");
  }
};

export const fetchProgress = async (exerciseId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from("progress")
      .select("*") // Select all columns, or specify specific columns if needed
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching progress:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

export const fetchUserId = async (): Promise<string | null> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn("User is not logged in");
      return null; // Return null if no user is logged in
    }

    return user.id;
  } catch (error) {
    console.error("Unexpected error during fetchUserId:", error);
    return null; // Ensure null is returned on error
  }
};

export const signOut = async (): Promise<string | null> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.warn("Sign out error:", error);
    } else {
      console.log("Signed out successfully.");
    }

    return null;
  } catch (error) {
    console.error("Sign out error:", error);
    return null;
  }
};
