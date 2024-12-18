import { NextResponse } from "next/server";
import { client as sanity } from "@/lib/sanityClient";
import { createClient } from "@/app/utils/supabase/client";

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

  // Flatten exercises for easier handling
  const flattenedExercises: SanityExercise[] = lessonWithExercises.flatMap(
    (lesson: { _id: string; exercises: any[] }) =>
      lesson.exercises.map((exercise) => ({
        id: exercise.id, // Use the UUID field
        title: exercise.title,
        type: exercise.type || null,
        description: exercise.description || null,
        video_url: exercise.videoUrl || null,
        soundslice_url: exercise.soundsliceUrl || null,
        lesson_id: lesson._id, // Reference to the parent lesson
      }))
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

  // Upsert exercises
  for (const exercise of exercises) {
    await supabase.from("exercises").upsert([
      {
        id: exercise.id,
        lesson_id: exercise.lesson_id,
        title: exercise.title,
        type: exercise.type,
        description: exercise.description,
        video_url: exercise.video_url,
        soundslice_url: exercise.soundslice_url,
      },
    ]);
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
