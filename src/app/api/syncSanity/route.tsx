import { NextResponse } from "next/server";
import { client as sanity } from "@/lib/sanityClient";
import { createClient } from "@/app/utils/supabase/client";

const supabase = createClient();

async function fetchSanityData() {
  // Fetch courses
  const courses = await sanity.fetch(
    `*[_type == "course"] { _id, title, description }`
  );

  // Fetch lessons with course relationship
  const lessons = await sanity.fetch(
    `*[_type == "lesson"] {
      _id,
      title,
      description,
      "course_id": course->_id // Fetch the course ID via reference
    }`
  );

  // Fetch exercises with lesson relationship
  const exercises = await sanity.fetch(
    `*[_type == "lesson"] {
      _id, // Lesson ID
      exercises[]{
        _key, // Use _key as unique ID for exercises
        title,
        type,
        "lesson_id": ^._id, // Parent lesson ID
        description,
        videoUrl,
        soundsliceUrl
      }
    }`
  );

  // Flatten exercises for easier handling
  const flattenedExercises = exercises.flatMap((lesson) =>
    lesson.exercises.map((exercise) => ({
      id: exercise._key, // Unique ID for Supabase
      title: exercise.title,
      type: exercise.type,
      description: exercise.description,
      video_url: exercise.videoUrl || null,
      soundslice_url: exercise.soundsliceUrl || null,
      lesson_id: exercise.lesson_id, // Reference to the parent lesson
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
        id: exercise.id, // Use _key as unique ID
        lesson_id: exercise.lesson_id || null, // Reference parent lesson
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
  } catch (error) {
    console.error("Sync failed:", error);
    return NextResponse.json(
      { error: "Failed to sync data." },
      { status: 500 }
    );
  }
}
