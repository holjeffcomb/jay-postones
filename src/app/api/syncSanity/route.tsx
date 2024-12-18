import { NextResponse } from "next/server";
import { client as sanity } from "@/lib/sanityClient";
import { createClient } from "@/app/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

// Define types for Sanity data
interface SanityCourse {
  _id: string;
  title: string;
  description: string;
}

interface SanityLesson {
  _id: string;
  title: string;
  description: string;
  course_id?: string | null; // Optional if no course exists
}

interface SanityExercise {
  id: string; // Use the UUID from Sanity schema
  title: string;
  type?: string; // Optional
  description?: string; // Optional
  video_url?: string | null;
  soundslice_url?: string | null;
  lesson_id: string; // Reference to the parent lesson
}

async function fetchSanityData(): Promise<{
  courses: SanityCourse[];
  lessons: SanityLesson[];
  exercises: SanityExercise[];
}> {
  // Fetch courses
  const courses: SanityCourse[] = await sanity.fetch(
    `*[_type == "course"] { _id, title, description }`
  );

  // Fetch lessons with course relationships
  const lessons: SanityLesson[] = await sanity.fetch(
    `*[_type == "lesson"] {
      _id,
      title,
      description,
      "course_id": course->_id,
    }`
  );

  // Fetch exercises with lesson relationships
  const lessonWithExercises = await sanity.fetch(
    `*[_type == "lesson"] {
      _id,
      exercises[]{
        id,
        title,
        type,
        "lesson_id": ^._id,
        description,
        videoUrl,
        soundsliceUrl
      }
    }`
  );

  console.log(
    "Lessons with Exercises:",
    JSON.stringify(lessonWithExercises, null, 2)
  );

  // Flatten exercises for easier handling
  const flattenedExercises: SanityExercise[] = lessonWithExercises.flatMap(
    (lesson: { _id: string; exercises: any[] }) =>
      lesson.exercises.map((exercise) => ({
        id: exercise.id || uuidv4(), // Generate a new UUID if id is missing
        title: exercise.title || "Untitled Exercise",
        type: exercise.type || null,
        description: exercise.description || null,
        video_url: exercise.videoUrl || null,
        soundslice_url: exercise.soundsliceUrl || null,
        lesson_id: lesson._id, // Parent lesson ID
      }))
  );
  console.log(
    "Flattened Exercises:",
    JSON.stringify(flattenedExercises, null, 2)
  );
  return { courses, lessons, exercises: flattenedExercises };
}

async function syncToSupabase() {
  const { courses, lessons, exercises } = await fetchSanityData();

  // Upsert courses
  for (const course of courses) {
    await supabase.from("courses").upsert([
      {
        id: course._id,
        title: course.title,
        description: course.description,
      },
    ]);
  }

  // Upsert lessons
  for (const lesson of lessons) {
    await supabase.from("lessons").upsert([
      {
        id: lesson._id,
        course_id: lesson.course_id || null, // Set to null if no parent course
        title: lesson.title,
        description: lesson.description,
      },
    ]);
  }

  for (const exercise of exercises) {
    // Ensure the id is valid as a UUID
    const exerciseId = exercise.id || uuidv4();

    console.log("Attempting to upsert exercise:", {
      ...exercise,
      id: exerciseId,
    });

    const { error } = await supabase.from("exercises").upsert([
      {
        id: exerciseId, // Explicitly ensure this is a UUID string
        lesson_id: exercise.lesson_id,
        title: exercise.title || "Untitled Exercise",
        description: exercise.description || null,
        video_url: exercise.video_url || null,
        soundslice_url: exercise.soundslice_url || null,
      },
    ]);

    if (error) {
      console.error(
        `Failed to insert exercise "${exercise.title}" (ID: ${exerciseId}):`,
        error
      );
    } else {
      console.log(
        `Exercise "${exercise.title}" (ID: ${exerciseId}) upserted successfully.`
      );
    }
  }

  console.log("Sanity data synced to Supabase!");
}

export async function POST() {
  try {
    await syncToSupabase();
    return NextResponse.json(
      { message: "Sanity data synced successfully!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Sync failed:", error);
    return NextResponse.json(
      { error: "Failed to sync data." },
      { status: 500 }
    );
  }
}
